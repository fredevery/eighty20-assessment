import json
import os

import requests
from django.core.management.base import BaseCommand, CommandError

POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon?limit=1302"

PROJECT_POKEMON_SPRITE_URLS = [
    "https://projectpokemon.org/images/normal-sprite/",
    "https://projectpokemon.org/images/sprites-models/swsh-normal-sprites/",
]


class Command(BaseCommand):
    def handle(self, *args, **options):
        cwd = os.getcwd()
        print(f"Current working directory: {cwd}")
        r = requests.get(POKEAPI_URL)
        data = r.json()

        if "results" not in data:
            raise CommandError("Invalid response from PokeAPI")

        pokemon_list = data["results"]
        if not pokemon_list:
            raise CommandError("No Pokémon found in the response")

        pokemon_output = []
        spriteless = []
        for pokemon in pokemon_list:
            name = pokemon["name"]
            url = pokemon["url"]
            id = url.split("/")[-2]

            sprite_url = None
            for source_url in PROJECT_POKEMON_SPRITE_URLS:
                sprite_url = f"{source_url}{name}.gif"
                sprite_filename = f"{id}_{name}.gif"
                sprite_r = requests.get(sprite_url)
                if sprite_r.status_code == 200:
                    img_data = sprite_r.content
                    with open(f"{cwd}/sprites/{sprite_filename}", "wb") as img_file:
                        img_file.write(img_data)
                    break
                else:
                    sprite_url = None
            if not sprite_url:
                spriteless.append((id, name, url))
            pokemon_output.append(
                {
                    "id": id,
                    "name": name,
                    "url": url,
                    "sprite_filename": sprite_filename,
                    "sprite_url": sprite_url,
                }
            )
            self.stdout.write(f"{id} : {name} : {url}")

        if spriteless:
            print("The following Pokémon do not have sprites:")
            for id, name, url in spriteless:
                print(f"{id} : {name} : {url}")

        with open(f"{cwd}/pokemon_output.json", "w") as f:
            json.dump(pokemon_output, f, indent=4)
