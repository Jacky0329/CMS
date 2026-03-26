from django.core.management.base import BaseCommand, CommandError

from axes.models import AccessAttempt


class Command(BaseCommand):
    help = 'Unlock a user account locked by django-axes'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username to unlock')

    def handle(self, *args, **options):
        username = options['username']
        deleted, _ = AccessAttempt.objects.filter(username=username).delete()
        if deleted:
            self.stdout.write(self.style.SUCCESS(
                f'Successfully unlocked "{username}" ({deleted} attempt(s) cleared).'
            ))
        else:
            self.stdout.write(self.style.WARNING(
                f'No lock records found for "{username}". Account may not be locked.'
            ))
