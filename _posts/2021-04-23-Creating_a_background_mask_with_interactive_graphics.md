---
layout: post
title: Creating a background mask with interactive graphics
date: 2021-04-23 16:00:00 +0100
author: Mike
---

When making quantitative measurements with an instrument it is important to get a measure of the background.

All instruments suffer from noise and maybe interferences, which would lead to an overestimation of your true reading.

This is especially important detecting at low levels when you really push the performance of your device.

With the ToF-CIMS we displace the sampled air with pure nitrogen to see how much signal is left over that we should subtract from the actual reading.

In this ambient dataset measuring the air just outside a town in Finland, the times of these backgrounds we not recorded.

This means we have to manual state that a background was occurring.

This could be quite daunting if the task is to manually create a mask when faced with just a spreadsheet.

Instead I opted to create a nice graphical interface in jupyter notebooks that would make logging the backgrounds easy.

So first plot the data and make it interactive with:

 {% highlight python %} %notebook matplotlib {% endhighlight %}

 ![Capture3]({{ "/assets/bg_mask/Capture3.PNG" | absolute_url }})

You can see the top plot shows measured data points labeled gas, ramp and soak. You can see the red boxes show low and stable measurements, these are the background points.

The plot beneath shows the mask for the other stages: gas, ramp and soak, but ideally we'd have an entry for background as well. Instead we will make a separate mask, just to keep it obvious

Using the fig.canvas.mpl_connect() method (found on stackoverflow somewhere) to connect two functions to a button press and button release events.

 {% highlight python %}

 # First make the plot
 fig, ax = plt.subplots(figsize=(14,5), nrows=2, sharex=True)

 m="C6H10IO5"
 df.loc[df["Step Type"] == 1, m].plot(legend=False,  marker=".", ls=" ", ax=ax[0], label="gas")
 df.loc[df["Step Type"] == 2, m].plot(legend=False,  marker=".", ls=" ", ax=ax[0], label="ramp")
 df.loc[df["Step Type"] == 3, m].plot(legend=False,  marker=".", ls=" ", ax=ax[0], label="soak")
 df["Step Type"].plot(legend=False,  ls="-", ax=ax[1])
 ax[0].legend();

 # Initialise empty array to store data
 pos= []

 # Define two event functions
 def press(event):
     entry = mdates.num2date(event.xdata)
     # add 2 element list with first entry of first time
     pos.append([entry,0])

 def release(event):
     entry = mdates.num2date(event.xdata)
     # convert second entry from 0 to actual data
     pos[-1][1] = entry
     # make the list a tuple
     pos[-1] = tuple(pos[-1])

 # Connect the functions to the event
 fig.canvas.mpl_connect('button_press_event', press)
 fig.canvas.mpl_connect('button_release_event', release)
 fig.show()

 # Initialise start date
 start = "2020-11-15 12:00"
 start = dt.datetime.strptime(start, "%Y-%m-%d %H:%M")

 # Print stored results to screen to check its working
 pos

{% endhighlight %}

These functions append the xdata in a predefined empty array

So when I click in the plot at the start of the background, the time it begins is stored, and then I release at the end of the background period to store the end.

These pairs of points are stored as tuples so I don't accidentally overwrite them. You can see them printed to screen here.

![Capture5]({{ "/assets/bg_mask/Capture5.PNG" | absolute_url }})

I want to use this info to create a mask of when the backgrounds were occurring, so I first initialise a dataframe with the same index of the data and fill it with 0s.

Then iterate over every date pair in the array and set the values to 1 in between the dates

Sometimes if I made a bad click or release there was only one value instead of two, but a try except statement ignored these and I would just have to go over those points again no problems.


{% highlight python %}

# Make a copy - just to be safe!
bg_times = pos.copy()

# Initialise dataframe with all 0s
bg_step = pd.DataFrame(index=data.index, columns=["gas bg"], data=0)

# Iteratively populate dataframe with 1's between datetime start/end pair values
for i, pair in enumerate(bg_times):
    try:
        bg_step.loc[pair[0]:pair[1], "gas bg"] = 1
    except:
        # missed the click release so just add 8 mins from start. (This was the length of the bg period)
        # can double check later
        print(i, pair)
        bg_times[i] = (bg_times[i][0],  bg_times[i][0]+dt.timedelta(minutes=8))
        print(i, bg_times[i])

bg_step.to_csv("../gas_bg_step.csv")

{% endhighlight %}

Now we saved the dataframe so we can read it in any time to access our newly created, relatively pain free, background bg_mask

![Capture6]({{ "/assets/bg_mask/Capture6.PNG" | absolute_url }})
