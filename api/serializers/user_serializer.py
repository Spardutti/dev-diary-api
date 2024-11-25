from rest_framework import serializers
from ..models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'last_visited_project']


    def create(self, validated_data):
        """
        Create and return a new user, ensuring the password is set properly.
        """
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)  # Hash the password
        
        user.save()
        return user