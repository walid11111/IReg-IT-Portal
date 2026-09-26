from django.db import models

class TeamMember(models.Model):
    CATEGORY_CHOICES = [
        ("frontend", "Frontend Engineer"),
        ("backend", "Backend Engineer"),
        ("software", "Software Engineer"),
        ("ai", "AI Engineer"),
    ]
    LEADERSHIP_CHOICES = [
        ("", "None"),
        ("overall", "Overall Team Lead"),
        ("frontend", "Frontend Team Lead"),
        ("backend", "Backend Team Lead"),
    ]
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    bio = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="software")
    leadership = models.CharField(max_length=20, choices=LEADERSHIP_CHOICES, default="", blank=True)
    photo = models.ImageField(upload_to="team/", blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.leadership:
            return
        label = dict(self.LEADERSHIP_CHOICES)[self.leadership]
        existing = TeamMember.objects.filter(leadership=self.leadership).exclude(pk=self.pk)
        if existing.exists():
            raise ValidationError({"leadership": f"{label} is already assigned to {existing.first().name}."})


class MemberSocial(models.Model):
    PLATFORM_CHOICES = [
        ("linkedin", "LinkedIn"),
        ("email", "Email (Gmail)"),
        ("github", "GitHub"),
        ("x", "X (Twitter)"),
        ("website", "Website / Portfolio"),
        ("other", "Other"),
    ]
    member = models.ForeignKey(TeamMember, related_name="socials", on_delete=models.CASCADE)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, default="linkedin")
    url = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        label = dict(self.PLATFORM_CHOICES).get(self.platform, self.platform)
        value = self.email or self.url
        return f"{self.member.name} — {label}: {value}"


class Service(models.Model):
    CATEGORY_CHOICES = [
        ("communication", "Communication & Marketing"),
        ("documents", "Documents & eSignature"),
        ("ai", "AI & Smart Automation"),
        ("contacts", "Contacts & Engagement"),
        ("general", "General"),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default="general")
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured services appear as large showcase blocks at the top.",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class ServiceFeature(models.Model):
    service = models.ForeignKey(Service, related_name="features", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.name


class Job(models.Model):
    title = models.CharField(max_length=100)
    apply_link = models.URLField()
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured jobs are shown in the highlight card.",
    )
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title