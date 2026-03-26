from collections import defaultdict
from datetime import date

from django.db.models import Sum
from django.db.models.functions import TruncMonth, TruncYear
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin
from apps.branches.models import Branch
from apps.quotations.models import Quotation


class SalesReportView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        period = request.query_params.get('period', 'monthly')
        year = request.query_params.get('year', str(date.today().year))

        qs = Quotation.objects.filter(status='confirmed')

        branches = list(Branch.objects.values_list('id', 'name'))
        branch_map = {bid: bname for bid, bname in branches}
        branch_ids = [bid for bid, _ in branches]

        if period == 'yearly':
            rows = (
                qs.annotate(period=TruncYear('created_at'))
                .values('period', 'branch_id')
                .annotate(total=Sum('snapshot_price'))
                .order_by('period', 'branch_id')
            )
            raw = defaultdict(lambda: defaultdict(float))
            all_years = set()
            for row in rows:
                y = row['period'].year
                all_years.add(y)
                raw[y][row['branch_id']] = float(row['total'] or 0)

            if not all_years:
                current_year = int(year)
                all_years = {current_year}

            data = []
            for y in sorted(all_years):
                for bid in branch_ids:
                    data.append({
                        'period': str(y),
                        'branch_id': bid,
                        'branch_name': branch_map[bid],
                        'total': raw[y].get(bid, 0),
                    })

            return Response({
                'data': data,
                'errors': None,
                'meta': {'period': 'yearly'},
            })

        else:
            year_int = int(year)
            rows = (
                qs.filter(created_at__year=year_int)
                .annotate(period=TruncMonth('created_at'))
                .values('period', 'branch_id')
                .annotate(total=Sum('snapshot_price'))
                .order_by('period', 'branch_id')
            )
            raw = defaultdict(lambda: defaultdict(float))
            for row in rows:
                m = row['period'].month
                raw[m][row['branch_id']] = float(row['total'] or 0)

            data = []
            for month in range(1, 13):
                for bid in branch_ids:
                    data.append({
                        'period': f'{year_int}-{month:02d}',
                        'branch_id': bid,
                        'branch_name': branch_map[bid],
                        'total': raw[month].get(bid, 0),
                    })

            return Response({
                'data': data,
                'errors': None,
                'meta': {'period': 'monthly', 'year': year_int},
            })
