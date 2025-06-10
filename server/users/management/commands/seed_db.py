import json
import os

from django.core.management.base import BaseCommand, CommandError

from users.models import Pokemon


class Command(BaseCommand):
    def handle(self, *args, **options):
        with open(os.path.join(os.getcwd(), "seed_data", "pokemon.json"), "r") as f:
            for pokemon in json.load(f):
                key = pokemon.get("name", "")
                name = " ".join([w.capitalize() for w in key.split("-")])
                try:
                    Pokemon.objects.create(
                        external_id=pokemon["id"],
                        key=key,
                        name=name,
                        sprite_filename=pokemon.get("sprite_filename", ""),
                    )
                except Exception as e:
                    raise CommandError(f"Error creating Pokemon: {e}")
