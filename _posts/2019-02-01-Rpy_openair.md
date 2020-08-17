---
layout: post
title: Openair R module in Python Notebook 
date: 2019-01-22 12:035:00 +0100
author: Mike
---


['Openair'][openair] is a fantastic air quality analysis package with many extremely useful visualisations ready to use, often written with a single line.

I first learned openair at the start of my PhD (literally a week or so in) before I had any particular affinity for any programming language and so I dived head first into R and Rstudio.

I happily used R, Rstudio and openair for about a year, but I couldn't help noticing the plethora of easy to use, well documented, well troubleshooted (troubleshot?) python packages that seemed to lend themselves to the kind of work I was doing. Matplotlib just seemed so much easier than ggplot. I decided to give python a go.

Using scipy, pandas and matplotlib was a lot more intuitive than the equivalent in R and so I used both python and R for a time. However, the simplicity of python eventually won. I slowly stopped using R and stopped using openair.

The problem is: openair is really really good; so if I wanted a quick windrose or polar plot, I'd have to use R. Or would I? True to form, there is of course a python package, [rpy2][rpy2], that allows you to run R code in a python kernel.

I am sure there is way more to rpy2 than I could ever get my head around but all I care about is that I now have a way of using openair within python.

After installing openair and rpy2, you must set some environment variables so rpy2 knows where to look for the R exectuable and library. It's then as simple as:

{% highlight python %}
    from rpy2.robjects.packages import importr
    openair = importr('openair')
{% endhighlight %}

Now the openair package is accessible as a python object. You can now run openair plotting functions. However, the dataframe to pass to the plotting function must be an R dataframe, not a pandas dataframe. That must then be converted. 

{% highlight python %}
    from rpy2.robjects import pandas2ri
    pandas2ri.activate()
    r_df = pandas2ri.py2ri(df)
{% endhighlight %}

Now we can run the the plotting function.

{% highlight python %}
openair.windRose(mydata=r_df)
{% endhighlight %}

This opens a new window with the displayed graphic. This is great, now we have access to the plot. However, I would prefer it if I could put the plot inline within a notebook, then I could integrate it into my analyses.

After much stackoverflowing, I found a solution using the grdevices module of rpy2.robjects.lib. I wrapped that in a function with the openair plot function  and hey presto, inline openair plotting.

{% highlight python %}
def displayOpenairPlot(func, figsize=(10,10), res=150, *args, **kwargs):
       
    """
    Displays openair plots in a notebook inline.
    + func. openair callback.
    + figsize. tuple. figure size
    + res. int. resolution of figure
    + **kwargs. to be passed to func.
    """

    import IPython
    from rpy2.robjects.lib import grdevices    

    pixel_per_inch = 0.0104166667
    width, height =figsize[0]/pixel_per_inch, figsize[1]/pixel_per_inch   
    with grdevices.render_to_bytesio(grdevices.png, width=width, height=height, res=res) as img:
        plot = func(*args, **kwargs)
    IPython.display.display(IPython.display.Image(data=img.getvalue(), format='png', embed=True))
    
    return None

{% endhighlight %}

The *args and **kwargs are passed straight to the callback.

Somewhat uneccessarily, I wrapped a lot of this functionality into a [module][OpenairPy] that I could import and so use more cleanly in a notebook. This includes loading the openair module, converting a pandas dataframe to R dataframe (assuming it has a time series index) and displaying the plot inline. 

{% highlight python %}
from openairpy import OpenairPy
openair = OpenairPy.loadOpenair()
OpenairPy.displayOpenairPlot(openair.corPlot, mydata=r_df, dendrogram=True)
{% endhighlight %}

The only problem I have encountered so far is that the error messages are somewhat obscured. However, the most common error I encounter is:
{% highlight python %}
RRuntimeError: Error in checkPrep(mydata, vars, type, remove.calm = False) :
{% endhighlight %}

This indicates an incorrect argument has been passed to the r function. Typically this is to the pollutant keyword, especially if it contains any sort of punctuation character. These are rendered as '.' in an R dataframe. For example, a column heading of "SO4(AMS)/ugm3" would be converted to "SO4.AMS..ugm3".


Below is an example showing the openair pollutionRose function which is used to find the direction and frequency of a particular pollutant.

![figure.png]({{ "/assets/rpy_openair/figure1.png" | absolute_url }})






[openair]: http://davidcarslaw.github.io/openair/
[rpy2]: https://rpy2.readthedocs.io/en/version_2.8.x/
[OpenairPy]: https://github.com/Mbex/openairpy

