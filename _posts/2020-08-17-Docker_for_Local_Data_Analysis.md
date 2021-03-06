---
layout: post
title: Docker for Local Data Analysis
description: How I use Docker to analyse data
date: 2020-08-17 14:54:00 +0200
author: Mike
---

I recently decided to use [Docker][docker] to consolidate the code I've written for data analysis and preserve the environment it works in.

This was partly motivated by a somewhat painful, long overdue update to python 3, including updating the modules I've written. Specifically, the environment was a little tricky to set up correctly for the [openairpy module][openairpy], so it makes sense that this is only done once.

Secondly, I needed to port the environment from my old machine to a new one and would also like to share it with others.

Thirdly, there are other tools out there I would like to use that have docker files associated with them, e.g. [pybox][pybox] and [genchem][genchem], so rather than reconfigure my machine every 5 minutes it seems sensible to use what others have provided with docker.

I’m also finding it a great way to compartmentalise different workspaces.

The way I currently use docker for my own analysis is to spin up a container for each project I am working on. I use the container as a local jupyter notebook server which I can then access through a web browser on my machine. A small script initialises the container and mounts a directory on my machine so I can easily pass files in and out of the container. This is handy as, on a windows machine, you can double click the icon for the script rather than messing about at the PowerShell. The docker image I use for these containers pulls and installs packages from my github account so anything I have custom written for the analysis I do is easily accessible.

This is what the small script looks like:

{% highlight Dos %}
docker run --name docker_container --rm -it -p 8889:8888 -v C:\user\project\docker_share_dir\:/home/user/docker_dir/ docker_image
{% endhighlight %}

Here you can see I assign a name to the container, remove it after I am done with it, make it interactive, assign the port for port forwarding and mount a file space. Because everything is saved (i.e. datasets, notebooks) on the hard drive, it means I can remove the container when I no longer need it. Everything is still in place when I spin up a new one. The one downside is that with every new project I need to assign a new unique port to which the notebook it bound, this is to ensure I can run two containers and access the notebooks at the same time - which is handy for quickly copying and pasting code snippets between projects. I also need to keep all the data associated with that container in the same place on my machine, or otherwise update the script with the new file path to mount.

In fact this is exactly how I now use this blog. If I have a new post to write, I do that locally and collect all my assets. Then I double click an icon on my windows machine that initialises a docker container based on Ubuntu. It installs git, pulls my blog and creates a shared folder. Then I just copy and paste the .md and assets into the shared folder then move them to the correct directory inside the container. Then it is just a case of add, commit and push.

Obviously the power of docker is much greater than the simple case I use it for here, but I think this is a nice introduction to how the principles of the technology work and is a small but practical starting point that can be built upon in the future.

[docker]: https://www.docker.com/products/docker-desktop/
[openairpy]: https://micpri.github.io/2019/01/22/Rpy_openair.html
[pybox]: https://github.com/loftytopping/PyBox/
[genchem]: https://github.com/metno/genchem/
