# Generated by Django 5.1.4 on 2024-12-15 10:43

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('bio', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('isbn', models.CharField(max_length=13, unique=True)),
                ('available_copies', models.IntegerField(default=0)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='books', to='library.author')),
            ],
        ),
        migrations.CreateModel(
            name='BorrowRecord',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('borrowed_by', models.CharField(max_length=255)),
                ('borrow_date', models.DateField(auto_now_add=True)),
                ('return_date', models.DateField(blank=True, null=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='borrow_records', to='library.book')),
            ],
        ),
    ]
