from django.urls import path
from .views import (
    TeamMemberListView,
    ServiceListView,
    TechnologyListView,
    JobListView,
)

urlpatterns = [
    path("team/", TeamMemberListView.as_view(), name="team-list"),
    path("services/", ServiceListView.as_view(), name="service-list"),
    path("technologies/", TechnologyListView.as_view(), name="technology-list"),
    path("jobs/", JobListView.as_view(), name="job-list"),
]