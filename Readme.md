#This is a page where I will begin to address problems with our first iteration regarding structure and functionality. 


##Basic and necessary To Do's regardless of changes. 
  Push subscription services for etsy and webhooks for ebay must be installed.
  Figure out what is happening with ebay calls. (still making four returns?).
  User tokens need to be actually switched to session variables. Also consider if its safe to do so. 

##Structural notes
  Credential checks should be allocated to middleware so they are run before all etsy/ebay etc calls. If A user tries to do something without 3rd party credentials they are automatically forwarded to the Ouath external service.

  IMHO databse should probably be switched to postgres for many reasons largely involving ease of relating items to users and stores. How will that affect models, db writes/checks? Probably ends up being a Major overhaul that needs to be seriously considered. Relational DB definitely makes sense for the data were working with.  
    Data of items need to be reassesed, consider what other info would be necessary for valuable site analytics. 

  Routes will need to be rewritten to follow something more restful. They're a shit show right now.

  Need to address coherency of data:
    How to deal with expired items or changes in data? (mostly ebay)
    How to deal with notifications?
    




