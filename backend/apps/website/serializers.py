from rest_framework import serializers
from .models import TeamMember, MemberSocial, Service, ServiceFeature, Technology, Job

class MemberSocialSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()

    class Meta:
        model = MemberSocial
        fields = ["id", "platform", "value", "label", "order"]

    def get_value(self, obj):
        if obj.platform == "email":
            return obj.email or ""
        return obj.url

    def get_label(self, obj):
        return dict(MemberSocial.PLATFORM_CHOICES).get(obj.platform, obj.platform)

class TeamMemberSerializer(serializers.ModelSerializer):
    photo = serializers.SerializerMethodField()
    socials = MemberSocialSerializer(many=True, read_only=True)

    class Meta:
        model = TeamMember
        fields = "__all__"

    def get_photo(self, obj):
        if not obj.photo:
            return None
        request = self.context.get("request")
        url = obj.photo.url
        return request.build_absolute_uri(url) if request else url

class ServiceFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceFeature
        fields = ["id", "name", "order"]

class ServiceSerializer(serializers.ModelSerializer):
    features = ServiceFeatureSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = "__all__"

class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = "__all__"

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"