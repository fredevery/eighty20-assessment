from rest_framework import serializers

from .models import Pokemon, User


class PokemonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Pokemon
        fields = ["id", "external_id", "key", "name", "sprite_filename"]
        read_only_fields = ["id", "external_id", "key", "sprite_filename"]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    favourite_pokemon = PokemonSerializer(read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "favourite_pokemon"]
        read_only_fields = ["id"]
