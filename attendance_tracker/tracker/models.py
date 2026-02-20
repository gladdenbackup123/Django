from django.db import models

# Create your models here.
class Attendace(models.Model):
    name = models.CharField(max_length=100)
    regid = models.IntegerField()
    date = models.DateField()
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.name