from rest_framework.generics import ListAPIView
from .models import TeamMember, Service, Technology, Job
from .serializers import (
    TeamMemberSerializer,
    ServiceSerializer,
    TechnologySerializer,
    JobSerializer,
)

class TeamMemberListView(ListAPIView):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer

class ServiceListView(ListAPIView):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer

class TechnologyListView(ListAPIView):
    queryset = Technology.objects.filter(is_active=True)
    serializer_class = TechnologySerializer

class JobListView(ListAPIView):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer