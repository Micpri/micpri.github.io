---
layout: post
title: Webscraping for Metjobs Insights
date: 2021-08-06 12:27:00 +0100
author: Mike
---

During a brief period between jobs in 2018, I decided to try my hand at web scraping to generate a novel dataset on which to try some analysis.

I chose to scrape 13 years worth of job adverts from [metjobs][metjobs] (mid 2003-2016), a fantastic ever updating UK based job mailing list for environmental scientists archived online.

My logic here was to not only learn a new technique or two i.e. web scraping and natural language processing (NLP), but also find out some trends in my specific job market.

# Web Scraping

I used [Beautiful Soup][Beautiful Soup] to scrape the archive (with permission!) and saved the data locally.

I looked at setting up a database with [mongodb][mongodb] but as the data analysis (information!) was the more pressing aspect of the project I elected to save directly to file.

First I saved each months raw data to a pickle file using main.py.

# Cleaning

The content of each post for each month was cleaned something along the lines of:
  + get rid of html elements
  + get rid of junk characters e.g. "\\n", "\\xa0"
  + extract the header
  + get a related email address (used later to assess origin of the job post)

Then the actual body of the text was cleaned. This involved some learning key aspects of natural language / text processing.
  + all characters made lower case
  + all punctuation removed
  + all numbers were converted to words
  + all [stopwords][stopwords] were removed
  + [Stems][stems] of words were collated
  + [lemmatized][lemmas] words were collated
  + Assign language using a [language estimator][language estimator]

Next, these cleaned pickle files were written to a csv for easy interrogation. This resulted in an 80mb csv file (so not outrageous) of 10,887 entries.

Each entry has a unique ID, date, email address, a country (taken from the email address domain) content (tokenized text), stems, lemmas and language.

# Analysis

Now the fun bit.

The two main questions I had were essentially; what are the jobs, including what skills or fields are popular; and where are the jobs, this includes not just physical location / country but also institution? (This of course is skewed towards academia due to the data source).

Firstly, just by looking at the number of posts per month over time we can see the list is growing.

![posts per month]({{ "/assets/webscrape_metjobs/posts per month.png" | absolute_url }})

## Where are the jobs?

To answer the 'where are the jobs?' question I first split this into UK and non-UK jobs (As this is a UK list and I am in the UK it stands to reason).

Here we see if a post is from the UK (TRUE) or not (FALSE). It looks like half the job posts originate from the UK.

![posts per month UK or Not]({{ "/assets/webscrape_metjobs/posts per month UK or not.PNG" | absolute_url }})

If we look closer at the non UK jobs, we can see Germany, the USA and France are the largest contributors (not surprisingly!). Other than Australia, the USA and Canada, the top ten non UK contributors are European countries.

![posts per month non UK top 10]({{ "/assets/webscrape_metjobs/posts per month non UK top 10.png" | absolute_url }})

Interestingly then are the languages of the posts. Of course English is dominant with ~10,000 of the 10,887 entries written in that language. Unsurprisingly next is German with ~400 posts but then we see Croatian and Somali in the top 5.

![posts by language]({{ "/assets/webscrape_metjobs/posts by language.PNG" | absolute_url }})

This feels dubious, especially after looking at the top ten countries posting.

Digging a little deeper we see Croatia is posting the most in Croation, but this is only 12 posts in total. All in all, Croatian adverts are posted by 18 unique countries (20 bodies if including different UK sectors) - this also feels dubious. A similar story for the Somalian posts emergest as well.

![croatian and somali]({{ "/assets/webscrape_metjobs/croatian and somali.png" | absolute_url }})

Delving into the actual records, many of the designated Croatian entries have empty contents. Equally, the Somali designated content has a lot of non utf-8 characters remaining. I wanted to keep these in but it looks like they cause more of a problem. This is a good lesson in learning how to clean data appropriately and maybe don't believe everything you see (easier to do when the result looks fishy!).

## What are the jobs?

Next I wanted to see what kinds of jobs are coming up on this list, specifically the field of study and any skills or competencies that are mentioned.

This was a very broad brush analysis but provided some good insights.

Firstly, it became clear that as job postings increased over time, so would the incidences of certain words. In fact, this is essentially true for all key words that were searched. In these next plots, the left panel shows the absolute number of words per month. The right panel shows the number of words per month normalized to the total number of posts that month to tease out the trend.

You will see a linear trend fitted to all data. This of course is not always applicable.

Firstly just to check is the list working better for PhDs or post-docs? Looks to me like there are more PhD adverts in absolute terms but the trend favours postdocs. Interestingly post vs postdoc gives very different results indicating specificity in this instance was useful.

![phd vs postdoc]({{ "/assets/webscrape_metjobs/phd vs postdoc.png" | absolute_url }})

Secondly what kind of work is being advertised? This was a little more tricky to get a clear answer. I decided to look at measurements vs modeling which is a common split in the field. Underneath the meas and model plots you can see similar words that might indicate one or the other.

It looks like modeling adverts are more common than measurement adverts, although the trend for both is decreasing. Does this reflect a trend away from mentioning methodologies specifically?

![key skills measured modeled]({{ "/assets/webscrape_metjobs/key skills measured modeled.png" | absolute_url }})

If modeling is the more sought after skill compared to measurements then what are the specifics? Here we can see requests for programming actually decreasing over time whereas soft (assuming software) are increasing. This seems to demand a different kind of computer literacy.

Interestingly, programming languages such as matlab and python are mentioned more and more. Whilst matlabs trend appears linear python looks exponential and really kicked off midway through the analysis period. Excel has consistently been mentioned (no trend) and also at a greater frequency than the two more specialist programming languages.

![key skills programming]({{ "/assets/webscrape_metjobs/key skills programming.png" | absolute_url }})

Broadening the search beyond hard skills I thought to try looking at words that have more of an interdisciplinary tone. Of these, the word 'Risk' is the term to increase in frequency. This might be due to more climate risk type projects appearing on the list as more focus is given to the acuteness of the climate crisis. Another potential reason could be the funding for projects is coming from insurance companies who will fund projects quantifying risk e.g. extreme weather.

![key skills sector]({{ "/assets/webscrape_metjobs/key skills sector.png" | absolute_url }})

Finally, I tried to interogate  scientific diciplines to assess which field is the most prevalent, or likely to be in the near future. There are a lot of words used here with the key takeaways that Engin and Sea show both positive trends over time. Atmosph and aersol show a reduction and leveling off, likely due to the diversification of the list from its early days. 

The plot of these data is posted at the end of the article.

# Conclusions

This was a great exercise to understand  webscraping and NLP as well as providing insights into a specific job market via one very large email list.

Whilst the data collection and cleaning was rather straight forward the analysis was much more challenging.

Some issues with cleaning data incompletely led to strange results which were easily identified. Although on different datasets this might not be so obvious. Additionally bias with word selections could lead to incorrect interpretations.

In terms of future careers it looks like modeling work is the most advertised and a huge rise in python over recent years suggest this is a good skill to gain.

Country specific skill sectors might be an interesting continuation of this work. Equally more cleaning of the data and word selection might provide more insights as well. Shortening the study period to discount the first few years might also get rid of some less relevant data (for todays job market) and change some of the trends.

It would also be interesting to tie this data together with information on how the allocation of funding over recent years has changed.

I would love to try this again, now 3 years after the analysis was first performed to see if these trends remain true.





![key disciplines]({{ "/assets/webscrape_metjobs/key disciplines.png" | absolute_url }})

[metjobs]:https://www.lists.rdg.ac.uk/mailman/listinfo/met-jobs
[Beautiful Soup]:https://beautiful-soup-4.readthedocs.io/en/latest/
[mongodb]:https://www.mongodb.com/
[stopwords]:https://en.wikipedia.org/wiki/Stop_word
[stems]:https://stackoverflow.com/questions/1787110/what-is-the-difference-between-lemmatization-vs-stemming
[lemmas]:https://stackoverflow.com/questions/1787110/what-is-the-difference-between-lemmatization-vs-stemming
[language estimator]:https://pypi.org/project/langdetect/
