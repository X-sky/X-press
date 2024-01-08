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

## 定义模型

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

## 激活模型

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

## 管理网站

`Django` 提供了 **管理网站(admin site)** 可以轻松处理模型。

1. 通过执行命令 `python manage.py createsuperuser` 创建超级用户
2. 在 `learning_logs/admin.py` 中注册模型

```python
# admin.py
from django.contrib import admin

from .models import Topic
admin.site.register(Topic)

```

## 定义 Model Entry

```python
class Entry(models.Model):
    """学到的具体知识"""
    # Fohttps://docs.djangoproject.com/en/4.2/ref/models/fields/#foreignkey
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    text = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'entries'

    def __str__(self):
        return f"{self.text[:50]}..."
```

::: details 关于外键 foreign key

外键（foreign key）是一个数据库术语，它指向数据库中的另一条记录，这里是将每个条目关联到特定主题。创建每个主题时，都分配了一个键（ID）。需要在两项数据之间建立联系时，Django 使用与每项信息相关联的键。

实参 on_delete=models.CASCADE 让 Django 在删除主题的同时删除所有与之相关联的条目，这称为级联删除（cascading delete）。

:::

## Django shell

通过命令行 `python manage.py shell` ， 输入一些数据后可以通过类似交互式终端的方式查看数据，类似 `Read-Eval-Print-Loop (REPL)`。

一般在编写用户可请求的页面时，使用这种语法可以确认代码能获取所需的数据。

可以参考 `Django` 官方的[Making queries](https://docs.djangoproject.com/en/5.0/topics/db/queries/)查看模型操作相关方法

## Create Pages

使用 `Django` 创建页面的过程分为三个阶段：

- 定义 URL -> `/project/urls.py` 可以通过 `include` 函数等引用其他 `app`中的 `urls`
- 编写视图
- 编写模板

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

## 模板语法

> 可以使用模板继承于法对其他模板进行继承，但并非是重点。这部分可以让前端工程师进行专门开发，以定制化更具交互性和观赏性的网站。

通过使用模板标签 `{% %}` 进行内容渲染。例如：

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

```html
{% for item in list %} do something with each item {% empty %} do something is
list is empty {% endfor %}
```

:::

`{% csrf_token %}` 是 `Django` 用来防止`CSRF(Cross Site Request Forgery)` 攻击的模板标签