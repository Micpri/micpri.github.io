---
layout: post
title: Non-negative Matrix Factorisation (NMF)
date: 2020-08-22 18:00:00 +0100
author: Mike
---

Where the dimensionality of a dataset is large, it is useful to reduce that dimensionality to better understand properties or processes of the system under study. [Non-negative matrix factorisation (NMF)][NMF] is a dimensionality reduction technique used in various fields such as atmospheric chemistry [(Isokääntä et al., 2019)][Isokääntä et al., 2019] to simplify data interpretation [(Lee and Seung, 1999)][Lee and Seung, 1999]. 

Observations represented as a positive matrix V, with dimensions (n, m), are approximated by the factorised matrices W, with dimensions (n, k); and H, with dimensions (k, m); where k is the selected number of factors.

<img src="https://latex.codecogs.com/svg.latex?\Large&space;{\bf%20V}\approx{\bf%20W%20H}" title="\Large {\bf%20V}\approx{\bf%20W%20H}" />

I have recently used this technique to simplify a large dataset composed of emission factors measured by chemical ionisation mass spectrometry (CIMS). Hundreds of different ions are measured simultaneously as they are emitted for a number of different vehicles. This technique is useful to reduce that down and make the data more explainable.

I used [scikit-learns NMF module][scikit-learns NMF module] and lots of associated functionality e.g. scaling, pipelines. I wrapped some of that functionality in a [custom class][custom class], but the actual NMF computation is hidden in a black box (I did eventually have to go into the belly of scikit-learn to see which algorithm they use).

I have not formally studied NMF and if this something I want to publish, I really have to understand how it works. For that reason, I thought it would be a useful exercise to code it up and if I get stuck or I'm unsure as to whats going on, I can work through it until I do understand. 

[Click here to see that example]({{ "/assets/nmf/NMF_example.html" | absolute_url }}).

Note there are many features missing from this simple, single run (which are included in the CIMS EF work mentioned above). There is no exploration of the effects of [different cost functions, different update algorithms][Lee and Seung, 2001], [how to choose the correct number of factors][Brunet et al., 2004], the required number of iterations to find the solution, or how sensitive the dataset is to different random initial conditions. However working through the example forced me to understand what is actually happening when I hit run on the black box. Now I can confidently (to a point!) describe the process and understand some of the ins and outs of how to implement NMF.


#### References

Brunet, J. P., Tamayo, P., Golub, T. R. and Mesirov, J. P.: Metagenes and molecular pattern discovery using matrix factorization, Proc. Natl. Acad. Sci. U. S. A., 101(12), 4164–4169, doi:10.1073/pnas.0308531101, 2004.

Isokääntä, S., Kari, E., Buchholz, A., Hao, L., Schobesberger, S., Virtanen, A. and Mikkonen, S.: Comparison of dimension reduction techniques in the analysis of mass spectrometry data, Atmos. Meas. Tech. Discuss., 1–45, doi:10.5194/amt-2019-404, 2019.

Lee, D. D. and Seung, H. S.: Learning the parts of objects by non-negative matrix factorization, Nature, 401(6755), 788–791, doi:10.1038/44565, 1999.

Lee, D. D. and Seung, H. S.: Algorithms for non-negative matrix factorization, in Advances in neural information processing systems, pp. 556–562., 2001.


[NMF]: https://en.wikipedia.org/wiki/Non-negative_matrix_factorization/
[custom class]: https://github.com/Micpri/ToFCIMSAnalysis/blob/master/NMF.py
[scikit-learns NMF module]: https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.NMF.html
[Brunet et al., 2004]: https://www.pnas.org/content/101/12/4164/
[Isokääntä et al., 2019]: https://amt.copernicus.org/articles/13/2995/2020/amt-13-2995-2020.pdf
[Lee and Seung, 1999]: http://www.columbia.edu/~jwp2128/Teaching/E4903/papers/nmf_nature.pdf
[Lee and Seung, 2001]: https://papers.nips.cc/paper/1861-algorithms-for-non-negative-matrix-factorization.pdf
