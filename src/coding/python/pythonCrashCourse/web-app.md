---
outline: deep
title: "Web App"
description: "Python Crash Course web application development practice, including Django project creation and user authentication system"
---

# Web App

A practice of Chapters 18-20 of _Python Crash Course_.

[Source code](https://github.com/X-sky/Python-starter/tree/main/web_app_starter)

## Virtual Environments and Packages

> A [virtual environment](https://docs.python.org/3/tutorial/venv.html#) is a location in the system where you can install packages and isolate them from other Python packages.

Initialize a virtual environment by running `python -m venv <env_name>`.

::: tip About python command options

Available `python` command-line options can be found in the [official documentation](https://docs.python.org/3/using/cmdline.html). `-m` means running a module as a script.

:::

Activating the virtual environment varies depending on the `terminal`. For `bash`-like terminals (including `git bash` on `Windows`), run `source ./<env_name>/Scripts|bin/activate`. For `cmd`, `powershell`, or other `Windows command-line terminals`, run `<env_name>/Scripts/activate`.

To stop using the virtual environment, simply run `deactivate` while it's activated.

## Create Project

First, install Python packages and modules using [`pip`](https://pip.pypa.io/en/stable/getting-started/). `pip` is a tool for installing and managing Python packages and modules.

::: tip How does pip manage dependencies?

Unlike typical projects, it doesn't use `package.json` or `cargo.toml` or other formatted files to record dependencies. Dependencies are generally recorded via `pip freeze > requirements.txt`.

When managing a project with `git`, _do not_ commit `virtual environment` related code.

:::

Common `pip` commands include: `pip install <package>`; `pip list`. Here we use `pip install django` to install the `Django` module.

Then, initialize the project using the [`django-admin`](https://docs.djangoproject.com/en/4.2/ref/django-admin/#top) command.

Using `learning_log` as an example: `django-admin startproject learning_log .`

::: details About `django-admin`

1. django-admin is Django's command-line utility for administrative tasks
2. django-admin startproject name [directory] Creates a Django project directory structure for the given project name in the current directory or the given destination
3. if only name specified (without '.' to denote the directory), django will create a folder\<name\> and use that folder as the root folder of the project and create another folder\<name\> inside as the project package

:::

After the command executes, the directory structure looks like this:

```
manage.py
learning_log/
    __init__.py
    settings.py
    asgi.py
    wsgi.py
    urls.py
```

- `settings.py` specifies how `Django` interacts with the system and manages the project
- `urls.py` tells `Django` which pages to create in response to browser requests
- `wsgi.py` helps `Django` serve the files it creates. The filename is an acronym for Web Server Gateway Interface

Then run `python manage.py migrate` to migrate the database.

You can also run `python manage.py runserver` to verify that `Django` correctly created the project.

## Create App

A Django project consists of a series of applications that work together to form a whole. Simply put, a `project` contains several `applications`.

Create an application by running `python manage.py startapp <app_name>`.

### Define Models

> According to the [official definition](https://docs.djangoproject.com/en/5.0/topics/db/), a `Model` is the **single, definitive** source of information about your `data`. It contains the essential fields and behaviors of the data you're storing.

::: info

Generally, each model maps to a single database table. At the code level, a model is a class.

:::

For a `Model`, the most important part — and the only required part — is `Fields`. Each `field` should be an instance of the corresponding [`Field`](https://docs.djangoproject.com/en/4.2/ref/models/fields/#django.db.models.Field) class. All available `Field types` can be found at [`model-field-types`](https://docs.djangoproject.com/en/4.2/ref/models/fields/#model-field-types).

```python
class Topic(models.Model):
    """A topic the user is learning about"""

    # CharField  - https://docs.djangoproject.com/en/4.2/ref/models/fields/#charfield
    text = models.CharField(max_length=200)
    # DateTimeField - https://docs.djangoproject.com/en/4.2/ref/models/fields/#datetimefield
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """Return a string representation of the model"""
        return self.text
```

### Activate Models

To use models, you need to include the **App** in the **Project**. Open the project's `settings.py` and modify the following field:

```
--snip--
INSTALLED_APPS = [
    # My applications
    'learning_logs',

    # Default applications
     'django.contrib.admin',
    --snip--
]
--snip--
```

You also need to modify the database so it can store information related to `Model Topic`.

1. Run `python manage.py makemigrations learning_logs`. This command creates a migration file named `0001_initial.py` in the `learning_logs/migrations` folder, which will create a table for `Model Topic` in the database.
2. Then apply the changes: `python manage.py migrate`

::: tip

These two steps are needed every time you modify `Models`.

:::

### Admin Site

`Django` provides an **admin site** for easily managing models.

1. Create a superuser by running `python manage.py createsuperuser`
2. Register models in `learning_logs/admin.py` to enable model management on the admin site

```python
# admin.py
from django.contrib import admin

from .models import Topic
admin.site.register(Topic)
```

After creating the superuser and registering the admin site, you can access the admin site by appending `/admin` to the `runserver` URL, e.g., `localhost:8080/admin`.

### Define Model Entry

When you want to build relationships between models, you can use `ForeignKey` for association and define a `Meta` class within the model to set model-related information.

::: info About Class Meta

Model metadata is "anything that's not a field", such as ordering options ([`ordering`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.ordering)), database table name ([`db_table`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.db_table)), or human-readable singular and plural names ([`verbose_name`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.verbose_name) and [`verbose_name_plural`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.verbose_name_plural)). None are required, and adding `class Meta` to a model is completely optional.

:::

::: details About Foreign Keys

A foreign key is a database term that points to another record in the database — here it associates each entry with a specific topic. When each topic is created, it's assigned a key (ID). When a relationship needs to be established between two pieces of data, Django uses the key associated with each piece of information.

The argument on_delete=models.CASCADE tells Django to delete all associated entries when a topic is deleted. This is called cascading delete.

:::

For example, if we want to build a model `Entry` related to the `Topic` mentioned above:

```python
class Entry(models.Model):
    """Specific knowledge learned"""
    # https://docs.djangoproject.com/en/4.2/ref/models/fields/#foreignkey
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'entries'

    def __str__(self):
        return f"{self.text[:50]}..."
```

### Create Pages

For web applications, there are two dimensions: the data layer and the view layer. When building a web application, we need to consider three aspects: data, views, and interactions — the `MV*` development pattern commonly discussed in web development.

Creating pages with `Django` involves three parts:

- Building URL mappings
- Writing views (models / views)
- Writing templates

::: tip About URL Mappings

You can define them directly in the project's `/project/urls.py` file, or define them in the corresponding app's `/app/urls.py` and then reference them in `/project/urls.py` using the `include` function:

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('learning_logs.urls'))
]
```

:::

Although the order doesn't matter, the recommended sequence is: views -> templates -> URLs. Views may involve `model` and `context` injection, so this order minimizes dependency impact.

Views can be defined using either `class` or `function` approaches, with no significant difference overall.

```python
# function render
from django.shortcuts import render
def index(request):
    return render(request, {html_path})

# class render
from django.views.generic import TemplateView

class HomepageView(TemplateView):
    template_name = "helloworld/index.html"

```

You can inject models into views through `context`:

```python
from .models import Topic
def topics(request):
    """Show all topics"""
    topics = Topic.objects.order_by("date_added")
    context = {"topics": topics}
    # Context injection, template can now use the topics variable
    return render(request, "learning_logs/topics.html", context)
```

#### Templates Syntax

> Template inheritance syntax can be used to inherit from other templates, but this isn't the focus. This part can be handled by frontend engineers for more interactive and visually appealing websites.

`Django` enables `templates` to read `context` through content injection. It mainly consists of [three syntax categories](https://docs.djangoproject.com/en/4.2/topics/templates/#syntax):

1. Variables: `{{ some_expression|Filter }}`
2. Tags: `{% csrf_token %}` `{% url %}` `{% for %}` etc.
3. Comments: `{# single-line comment #}` `{% comment multi-line comment %}`

For example:

`{% url 'learning_logs:index' %}` generates a URL matching the pattern named `index` in `learning_logs/urls`.

` {% block {name} %}``{% endblock {name} %} ` defines placeholders whose content can be determined by child templates. `{% extend "{html_path}" %}` extends a template.

::: details {% block %} Example

```html
<!-- learning_logs/base.html -->
{% block content %}
<!-- Default template if child template has no corresponding input -->
<p>default Template</p>
{% endblock content %}
<!-- learning_logs/index.html -->
{% extends "learning_logs/base.html" %} {% block content %}
<p>
  Learning Log helps you keep track of your learning, for any topic you're
  learning about.
</p>
{% endblock content %}
```

The above code means:

1. The base template `base.html` defines a block placeholder named `content`
2. The child template `index.html` extends `base.html`
3. Uses `base.html`'s template and renders the `content` block placeholder as a `p` element

:::

Use `{% for i in items %}` `{% endfor %}` for loop syntax, and `{% empty %}` to tell `Django` what to do when the loop is empty.

::: details {% for %} Example

```
{% for item in list %}
do something with each item
{% empty %}
do something when list is empty
{% endfor %}
```

:::

`{% csrf_token %}` is a `Django` template tag used to prevent `CSRF (Cross Site Request Forgery)` attacks.

#### Create Forms

You can quickly create form handling models using `Django`'s built-in `forms` module:

```python
# forms.py
from django import forms
from .models import Topic

class TopicForm(forms.ModelForm):
    class Meta:
        model = Topic
        fields = ["text"]
        labels = {"text": "topic"}
```

Then create the corresponding new form view `def new_topic` and template `new_topic.html`. The view `def new_topic` handles both **template rendering** and **data updates**:

```python
# views.py
def new_topic(request):
    """Add a new topic"""
    if request.method != "POST":
        # No data submitted: create a blank form
        form = TopicForm()
    else:
        # POST data submitted, process the data
        form = TopicForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect("learning_logs:topics")

    # Display a blank form or indicate form data is invalid
    context = {"form": form}
    return render(request, "learning_logs/new_topic.html", context)
```

```html
# new_topic.html
<h1>Add a new topic</h1>
<form action="{% url 'learning_logs:new_topic' %}" method="post">
  {% csrf_token %} {{form.as_p}}
  <button name="submit">Add topic</button>
</form>
```

Finally, add the corresponding route information in `urls.py` to complete a form page.

::: tip

For specific `Field` types and `common methods` in Django's `forms` module, see [here](http://docs.djangoproject.com/en/4.2/ref/forms/fields/).

For the template API, see [here](https://docs.djangoproject.com/en/4.2/ref/forms/api/).

:::

## Authentication System

`Django` has a built-in user authentication system module for convenient registration, login, and logout.

Modify `urls.py` to quickly introduce authentication-related URL addresses (also need to include the current URL address in `/learning_log/urls.py`):

```python
# /users/urls.py
from django.urls import path, include

app_name = "users"
urlpatterns = [
    path("", include("django.contrib.auth.urls")),
]

```

::: details What URLs does include('django.contrib.auth.url') contain?

```
accounts/login/ [name='login']
accounts/logout/ [name='logout']
accounts/password_change/ [name='password_change']
accounts/password_change/done/ [name='password_change_done']
accounts/password_reset/ [name='password_reset']
accounts/password_reset/done/ [name='password_reset_done']
accounts/reset/<uidb64>/<token>/ [name='password_reset_confirm']
accounts/reset/done/ [name='password_reset_complete']
```

:::

For more about the authentication system, see the official documentation: [Using the Django authentication system](https://docs.djangoproject.com/en/4.2/topics/auth/default/).

### User System

#### Login

When users visit `localhost:8000/users/login`, `Django` accesses the default view function `login`, but the template still needs to be provided manually.

`Django`'s default authentication system looks for templates in the `registration` folder, so create `login.html` in `/users/template/registration` to provide the default login template:

```html
{# login.html #} {% extends "learning_logs/base.html" %} {% block content %} {%
if form.errors %}
<p>Your username and password didn't match. Please try again</p>
{% endif %}

<form method="post" action="{% url 'users:login' %}">
  {% csrf_token %} {{ form.as_p }}
  <button name="submit">Log in</button>
  <input type="hidden" name="next" value="{% url 'learning_logs:index' %}" />
</form>

{% endblock content %}
```

A few things to note in the template:

1. An app's template can extend templates from another app
2. The template's built-in `context` has a `form` variable, see [Create Forms](#create-forms)
3. Both the form's submission and access URLs are `users/login`
4. The `input` tag can use `[name="text"] [value="xxx"]` to tell `Django` where to redirect after submission

#### Logout

Similarly, create `logged_out.html` to notify users of successful logout. Note that even without creating this page, `Django@4.2.9` will default to a `logged_out` page.

```html
{# logged_out.html #} {% extends "learning_logs/base.html" %} {% block content
%}
<p>You have been logged out. Thank you for visiting!</p>

{% endblock content %}
```

#### Register

Using `UserCreationForm`, `Django` can quickly create users:

```python
# Empty registration form
form = UserCreationForm()
```

Create the corresponding view in `views`, register the data, then follow the [Create Forms](#create-forms) approach to build the `register` registration page.

### Access Control

> A [decorator](https://docs.djangoproject.com/en/4.2/topics/http/decorators/) is a directive placed before a function definition. Python uses it to modify the function's code behavior before the function runs.

`Django` provides the `@login_required` decorator, allowing you to easily restrict certain pages to logged-in users only.

By adding `@login_required` before `views`, you can restrict the corresponding view to authenticated access only:

```python
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required # [!code ++]

from .models import Topic, Entry


@login_required  # [!code ++]
def topics(request):
    """Show all topics."""
```

When unauthenticated users request a page protected by `@login_required`, `Django` redirects to the URL specified by `LOGIN_URL` in `settings.py`. If not specified, a `404` error occurs.

Setting `LOGIN_URL = 'users:login'` will automatically redirect to the `login` view under the `/users` app.

#### User Related Model

To associate data with the users who submitted it, simply associate the top-level data with users — lower-level data will automatically be associated.

```python
from django.db import models
from django.contrib.auth.models import User # [!code ++]

# Create your models here.
class Topic(models.Model):
    """A topic the user is learning about"""

    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE) # [!code ++]
```

When migrating the database, Django will modify it to store the association between `Topic` and `User`. But how should existing `Topics` be handled? The simplest approach is to associate all existing topics with the same user, such as the initially created `superuser`.

In the [Django Shell](#django-shell), you can quickly view all user information:

```
>>> from django.contrib.auth.models import User
>>> User.objects.all()
 <QuerySet [<User: ll_admin>, <User: eric>, <User: willie>]>
>>> for user in User.objects.all():
...     print(user.username, user.id)
...
ll_admin 1
```

After obtaining the user ID, you can migrate the database. Run `python manage.py makemigrations learning_logs` for migration, follow the prompts, then apply: `python manage.py migrate`.

#### Specified User Access Control

After login, the view's `request` parameter has a `user` attribute containing information about the user.

In `Django`, you can use the `filter` operation on model objects to quickly restrict access, ensuring `Topics` can only be accessed by their associated users:

```python
--snip--
@login_required
def topics(request):
    """Show all topics."""
    topics = Topic.objects.order_by('date_added') # [!code --]
    topics = Topic.objects.filter(owner=request.user).order_by('date_added') # [!code ++]
    context = {'topics': topics}
    return render(request, 'learning_logs/topics.html', context)
--snip--
```

For all views with user-specific requirements, targeted code modifications are needed. For example, individual topics — without restrictions, any user could access a page by specifying the URL (`localhost:8000/topics/1/`). The `topic view` needs to be modified:

```python
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404 # [!code ++]
--snip--
@login_required
def topic(request, topic_id="1"):
    """Show a single topic"""
    topic = Topic.objects.get(id=topic_id)
    # Verify the requested topic belongs to the current user
    if topic.owner != request.user: # [!code ++]
        raise Http404 # [!code ++]
     context = {"topic": topic, "entries": entries}
    return render(request, "learning_logs/topic.html", context)
--snip--
```

The standard practice when a requested resource doesn't exist on the server is to return a 404 response. Here we import the `Http404` exception and check the user against the current topic during requests. If they don't match, an exception is raised and `Django` returns a 404 page.

::: tip

The `raise` keyword actively raises an exception, similar to `throw` in JavaScript.

:::

## Django Shell

Through the command `python manage.py shell`, after entering some data, you can view data through an interactive terminal-like interface, similar to `Read-Eval-Print-Loop (REPL)`.

This syntax is generally used when writing user-requestable pages to confirm that code can retrieve the needed data.

See Django's official [Making queries](https://docs.djangoproject.com/en/5.0/topics/db/queries/) for model operation methods.
