---
outline: deep
---

# Web App

A practice of Chapters 18-20 of _Python Crash Course_.

[Source code](https://github.com/X-sky/Python-starter/tree/main/web_app_starter)

## Virtual Environments and Packages

> [虚拟环境](https://docs.python.org/3/tutorial/venv.html#)是系统的一个位置，可在其中安装包，并将之与其他 Python 包隔离。

通过执行命令行 `python -m venv <env_name>` 初始化虚拟环境

::: tip 关于 python command options

可用的 `python` 命令行操作可以参考[官方文档](https://docs.python.org/3/using/cmdline.html)。`-m` 指的是将某个模块作为脚本运行

:::

激活虚拟环境根据 `终端Terminal` 不同而发生变化。如果是类 `bash` 的终端（包括 `windows` 下的 `git bash`），执行`source ./<env_name>/Scripts|bin/activate` 即可。如果是 `cmd` `powershell` 等 `windows命令行终端`，则需要执行 `<env_name>/Scripts/activate` 激活

停止使用虚拟环境，在激活状态下直接执行 `deactivate` 即可

## Create Project

首先，使用 [`pip`](https://pip.pypa.io/en/stable/getting-started/) 安装 `python` 包和模块。`pip` 是安装和管理 `Python` 包和模块的一个工具。

::: tip pip 如何管理依赖？

与一般的项目不同，没有使用 `package.json`，或者`cargo.toml` 等格式化文件记录依赖。一般通过 `pip freeze > requirements.txt` 记录当前项目的依赖

当使用 `git` 管理项目的时候，_不要_ 提交 `虚拟环境` 相关的代码

:::

`pip` 的常用命令有：`pip install <package>`; `pip list`。这里使用 `pip install django` 来安装 `Django` 模块

然后，使用 [`django-admin`](https://docs.djangoproject.com/en/4.2/ref/django-admin/#top) 命令初始化项目

以`learning_log` 项目为例：`django-admin startproject learning_log .`

::: details 关于`django-admin`

1. django-admin is Django's command-line utility for administrative tasks
2. django-admin startproject name [directory] Creates a Django project directory structure for the given project name in the current directory or the given destination
3. if only name specified (without '.' to denote the directory), django will create a folder\<name\> and use that folder as the root folder of the project and create another folder\<name\> inside as the project package

:::

命令执行完毕后在当前文件夹下目录如下所示：

```
manage.py
learning_log/
    __init__.py
    settings.py
    asgi.py
    wsgi.py
    urls.py
```

- `settings.py` 指定 `Django` 如何与系统交互以及如何管理项目
- `urls.py` 告诉 `Django`，应创建哪些页面来响应浏览器请求
- `wsgi.py` 帮助 `Django` 提供它创建的文件，这个文件名是 Web 服务器网关接口（Web server gateway interface）的首字母缩写

接着可以执行 `python manage.py migrate` 迁移数据库

还可以通过 `python manage.py runserver` 用来核实 `Django` 正确创建了项目

## Create App

Django 项目由一系列应用程序组成，它们协同工作让项目成为一个整体。简单来说，一个 `项目project` 包含了若干个 `应用application`

通过执行 `python manage.py startapp <app_name>` 创建一个应用

### Define Models

> 根据[官方定义](https://docs.djangoproject.com/en/5.0/topics/db/)，`模型Model` 就是能够描述 `数据data` 的 **唯一(single)准确(definitive)** 的信息源。它包括了存储数据的关键字段和行为。

::: info

一般来说，每个模型都映射了一张数据库的表。在代码层面，模型就是一个类

:::

对于 `模型Model` 来讲，最重要的部分————也是唯一要求必须存在的部分就是 `字段Fields`。每个 `field` 都应该是对应 [`Field`](https://docs.djangoproject.com/en/4.2/ref/models/fields/#django.db.models.Field) 的一个实例。 所有可用的 `Field types` 可以参考 [`model-filed-types`](https://docs.djangoproject.com/en/4.2/ref/models/fields/#model-field-types)

```python
class Topic(models.Model):
    """用户学习的主题"""

    # CharField  - https://docs.djangoproject.com/en/4.2/ref/models/fields/#charfield
    text = models.CharField(max_length=200)
    # DateTimeField - https://docs.djangoproject.com/en/4.2/ref/models/fields/#datetimefield
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """返回模型的字符串表示"""
        return self.text
```

### Activate Models

使用模型需要让 `Django` 将 **应用程序(App)** 包含到 **项目(Project)** 中。为此，打开 **项目(Project)** 中的 `settings.py`，修改如下字段

```
--snip--
INSTALLED_APPS = [
    # 我的应用程序
    'learning_logs',

    # 默认添加的应用程序
     'django.contrib.admin',
    --snip--
]
--snip--
```

与此同时需要修改数据库，使其能够存储与 `Model Topic` 相关的信息。

1. 执行 `python manage.py makemigrations learning_logs`。该命令在 `learning_logs/migrations` 文件夹下面创建了一个名为 `0001_initial.py` 的迁移文件，这个文件将在数据库中为 `Model Topic` 创建一个表
2. 随后应用修改 `python manage.py migrate`

::: tip

每当修改 `Models` 的时候，都需要进行如上两个步骤

:::

### Admin Site

`Django` 提供了 **管理网站(admin site)** 可以轻松处理模型。

1. 通过执行命令 `python manage.py createsuperuser` 创建超级用户
2. 通过在 `learning_logs/admin.py` 中注册模型，实现管理网站的模型注册

```python
# admin.py
from django.contrib import admin

from .models import Topic
admin.site.register(Topic)
```

在完成超级用户的创建以及管理网站的注册后，既可以通过访问 `runserver` 启动的服务拼接 `/admin` 进入并登录管理网站。如 `localhost:8080/admin`

### Define Model Entry

当我们想要在模型之间构建关联关系的时候，可以通过设置 `ForeignKey` 来关联，并通过在模型中定义 `Meta` 类设置模型相关信息

::: info 关于 Class Meta

Model metadata is “anything that’s not a field”, such as ordering options ([`ordering`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.ordering)), database table name ([`db_table`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.db_table)), or human-readable singular and plural names ([`verbose_name`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.verbose_name) and [`verbose_name_plural`](https://docs.djangoproject.com/en/4.2/ref/models/options/#django.db.models.Options.verbose_name_plural)). None are required, and adding `class Meta` to a model is completely optional.

:::

::: details 关于外键 foreign key

外键（foreign key）是一个数据库术语，它指向数据库中的另一条记录，这里是将每个条目关联到特定主题。创建每个主题时，都分配了一个键（ID）。需要在两项数据之间建立联系时，Django 使用与每项信息相关联的键。

实参 on_delete=models.CASCADE 让 Django 在删除主题的同时删除所有与之相关联的条目，这称为级联删除（cascading delete）。

:::

比如我们想要构建上文提到的 `Topic` 主题相关的模型 `Entry`，定义如下

```python
class Entry(models.Model):
    """学到的具体知识"""
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

对于网页应用来说，分为数据层和视图层两个维度。因此当我们想要构建一个网页应用的时候需要考虑到：数据、视图、交互三个层面。也就是 WEB 开发中常说的 `MV*` 开发模式。

而使用 `Django` 创建页面的过程分为三个部分：

- 构建 url 映射
- 编写视图 (models / views)
- 编写模板 (template)

::: tip 关于 url 映射

可以直接在项目中的 `/project/urls.py`文件内定义，也可以在对应 app 的 `/app/urls.py` 中定义后，在`/project/urls.py` 中通过 `include` 函数等引用其他 `app`中的 `urls`，如下所示：

```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('learning_logs.urls'))
]
```

:::

虽然其顺序无关紧要，但个人推荐的顺序是 视图 -> 模板 -> url。视图可能会涉及 `model` 以及 `context` 注入，因此这个顺序可能造成的依赖影响较小。

在定义 views 的时候可以通过 `class` 或 `function` 的方式进行定义，总体上来说没有显著区别。

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

可以通过引入模型的方式，将模型通过 `context` 的方式注入到视图内

```python
from .models import Topic
def topics(request):
    """显示所有主题"""
    topics = Topic.objects.order_by("date_added")
    context = {"topics": topics}
    # context 注入，template 内即可使用 topics 变量
    return render(request, "learning_logs/topics.html", context)
```

#### Templates Syntax

> 可以使用模板继承于法对其他模板进行继承，但并非是重点。这部分可以让前端工程师进行专门开发，以定制化更具交互性和观赏性的网站。

`Django` 可以通过内容注入的方式，使 `template` 能够获取读取 `context` 的能力。主要由[三大类语法](https://docs.djangoproject.com/en/4.2/topics/templates/#syntax)组成：

1. Viriables 变量 `{{ some_expression|Filter }}`
2. Tags 标签 `{% csrf_token %}` `{% url %}` `{% for %}` 等
3. Comments `{# 单行注释 #}` `{% comment 多行注释 %}`

例如：

`{% url 'learning_logs:index' %}`可以生成 `learning_logs/urls` 中名为 `index` 的模式相匹配的 `URL`

` {% block {name} %}``{% endblock {name} %} `可以规定占位符，具体内容可由子模板确定。 `{% extend "{html_path}" %}` 用于扩展模板

::: details {% block %} 示例

```html
<!-- learning_logs/base.html -->
{% block content %}
<!-- 如果子模板没有相应输入则展示默认模板 -->
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

如上代码则表示：

1. 在基础模板 `base.html` 中规定了名为 `content` 的块级占位
2. 在子模板 `index.html` 中扩展了 `base.html`
3. 使用 `base.html` 的模板，并将名为 `content` 的块级占位渲染为 `p` 元素

:::

使用 `{% for i in items %}` `{% endfor %}` 可以使用循环语法，使用 `{% empty %}` 告诉 `Django` 在循环为空时如何处理

::: details {% for %} 示例

```
{% for item in list %}
do something with each item
{% empty %}
do something when list is empty
{% endfor %}
```

:::

`{% csrf_token %}` 是 `Django` 用来防止`CSRF(Cross Site Request Forgery)` 攻击的模板标签

#### Create Forms

可以通过 `Django` 内置的 `forms` 模块快捷创建表单处理模型

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

随后就可以创建对应的新建表单视图 `def new_topic` 和模板 `new_topic.html`了。其中视图层的 `def new_topic` 同时负责 **模板渲染** 和 **数据更新**

```python
# views.py
def new_topic(request):
    """添加新主题"""
    if request.method != "POST":
        # 未提交数据：创建一个表单
        form = TopicForm()
    else:
        # POST提交的数据，对数据进行处理
        form = TopicForm(data=request.POST)
        if form.is_valid():
            form.save()
            return redirect("learning_logs:topics")

    # 显示空表单或指出表单数据无效
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

最后在 `urls.py` 中补充对应的路由信息即可完成一个表单页面的创建

::: tip

`Django` 中 `forms` 模块具体的`Field` 和 `常用方法` 可以参考[这里]([Form fields | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/4.2/ref/forms/fields/))

关于模板 API 可以参考[这里]([The Forms API | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/4.2/ref/forms/api/))

:::

## Authentication System

`Django` 内置了用户权限系统模块，用以方便的进行注册、登录和注销

修改 `urls.py` 可以快速引入权限相关的 url 地址，（同时需要在 `/learning_log/urls.py`中引入当前 url 地址）

```python
# /users/urls.py
from django.urls import path, include

app_name = "users"
urlpatterns = [
    path("", include("django.contrib.auth.urls")),
]

```

::: details include('django.contrib.auth.url') 究竟包含了哪些 URL?

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

更多关于权限系统的介绍可以查看[官方文档]([Using the Django authentication system | Django documentation | Django (djangoproject.com)](https://docs.djangoproject.com/en/4.2/topics/auth/default/))

### User System

#### login

用户在访问 `localhost:8000/users/login` 的时候，`Django` 会访问默认视图函数 `login`，但模板仍然需要手动提供

`Django` 默认的权限系统会在文件夹 `registration` 中查找模板，因此在 `/users/template/registration` 中新建 `login.html` 以提供默认的登陆模板

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

模板中有几点需要注意：

1. 一个应用的模板可以继承另一个应用中的模板
2. 模板内置 `context` 中有 `form` 变量，可以参考[创建表单](#创建表单)
3. 表单的提交和访问地址都是 `users/login`
4. `input` 标签可以通过 `[name="text"] [value="xxx"]` 告知 `Django`，提交完成后的跳转页面

#### logout

同理可以创建 `logged_out.html` 用以在登出后通知用户操作成功。需要注意的是，即使不创建这个页面， `Django@4.2.9` 也会默认进入一个 `logged_out` 页面

```html
{# logged_out.html #} {% extends "learning_logs/base.html" %} {% block content
%}
<p>You have been logged out. Thank you for visiting!</p>

{% endblock content %}
```

#### register

借助 `UserCreateForm`，`Django` 可以快速创建用户

```python
# 空的注册表单
form = UserCreationForm()
```

在 `views` 中创建相应视图并注册数据，然后按照[创建表单](#Create Forms)的思路进行 `register` 注册页面的编写即可

### Access Control

> [装饰器（decorator）](https://docs.djangoproject.com/en/4.2/topics/http/decorators/)是放在函数定义前面的指令，Python 在函数运行前根据它来修改函数代码的行为

`Django`提供了装饰器`@login_required`，让你能够轻松地只允许已登录用户访问某些页面

通过在 `views` 前增加 `@login_required`，可以限制对应的视图只能在登陆状态下访问

```python
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required # [!code ++]

from .models import Topic, Entry


@login_required  # [!code ++]
def topics(request):
    """显示所有的主题。"""
```

未登录的用户请求装饰器`@login_required`保护的页面时，`Django` 会重定向到`settings.py`中的`LOGIN_URL`指定的`URL`。如果未指定，则会报一个 `404` 的错误

指定`LOGIN_URL = 'users:login'`代码后，将自动跳转到 `/users`应用下的 `login` 视图

#### User Related Model

要将数据关联到提交它们的用户。只需将最高层的数据关联到用户，更低层的数据就会自动关联到用户

```python
from django.db import models
from django.contrib.auth.models import User # [!code ++]

# Create your models here.
class Topic(models.Model):
    """用户学习的主题"""

    text = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE) # [!code ++]
```

迁移数据库时，Django 将对数据库进行修改，使其能够存储`Topic` 和 `User` 之间的关联。但既有 `Topic` 要如何处理呢？最简单的办法是将既有主题都关联到同一个用户，如最开始创建的 `superuser` 。

在 [Django Shell](#Django Shell) 中可以快速查看当前所有用户的信息

```
>>> from django.contrib.auth.models import User
>>> User.objects.all()
 <QuerySet [<User: ll_admin>, <User: eric>, <User: willie>]>
>>> for user in User.objects.all():
...     print(user.username, user.id)
...
ll_admin 1
```

获取用户 ID 后，就可以迁移数据库了。通过执行 `python manage.py makemigrations learning_logs` 进行数据库迁移，根据指示迁移完毕后，就可以应用迁移了 `python manage.py migrate`

#### Specified User Access Control

用户在登陆后，视图的 `request` 参数将有一个 `user` 属性，其中存储了有关该用户的信息。

因此在 `Django` 中可以通过对模型对象操作`filter` 实现快捷限制访问的目的，使 `Topic` 只能被当前关联用户访问

```python
--snip--
@login_required
def topics(request):
    """显示所有的主题。"""
    topics = Topic.objects.order_by('date_added') # [!code --]
    topics = Topic.objects.filter(owner=request.user).order_by('date_added') # [!code ++]
    context = {'topics': topics}
    return render(request, 'learning_logs/topics.html', context)
--snip--
```

对于所有的视图，如果有指定用户的需求，都需要在代码中有针对性的修改。例如单个主题，如果没有做限制，那么任何用户都可以通过指定 `URL (localhost:8000/topics/1/)` 来访问对应页面。为此需要对 `topic view` 进行修改

```python
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404 # [!code ++]
--snip--
@login_required
def topic(request, topic_id="1"):
    """显示单个主题"""
    topic = Topic.objects.get(id=topic_id)
    # 确认请求的主题属于当前用户
    if topic.owner != request.user: # [!code ++]
        raise Http404 # [!code ++]
     context = {"topic": topic, "entries": entries}
    return render(request, "learning_logs/topic.html", context)
--snip--
```

服务器上没有请求的资源时，标准的做法是返回 404 响应。这里导入了异常 `Http404`，并在用户请求时判断用户与当前主题，如果不匹配则引发异常，`Django` 会返回一个 404 页面

::: tip

关键字`raise` 的作用是主动引发异常，与 `javascript` 中的 `throw` 类似

:::

## Django Shell

通过命令行 `python manage.py shell` ， 输入一些数据后可以通过类似交互式终端的方式查看数据，类似 `Read-Eval-Print-Loop (REPL)`。

一般在编写用户可请求的页面时，使用这种语法可以确认代码能获取所需的数据。

可以参考 `Django` 官方的[Making queries](https://docs.djangoproject.com/en/5.0/topics/db/queries/)查看模型操作相关方法
