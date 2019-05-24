# MangaReaderApp-React-Native
Personal project : manga reading app working on Android and iOS.  
Both app are connected to a [Firebase](https://firebase.google.com) project witch allow
 them to access a NoSQL database ([Cloud Firestore](https://firebase.google.com/products/firestore/)).  
Database is in this format : mangas > manga > chapters > chapter > pages > page.url

## Login screen
> Login with mail and password and remember me option.
<img src="./screenshots/mangareaderapp-login.jpg" width="280" height="500"/>

## Manga list screen
> Possibility to mark manga as **favorite**
<img src="./screenshots/mangareaderapp-mangalist.jpg" width="280" height="500"/>

## Manga list screen search 
> Possibility to search manga by name
<img src="./screenshots/mangareaderapp-mangalist-search.jpg" width="280" height="500"/>

## Chapter list screen
> Possibility to filter from new to old and from old to new.
> Long press on chapter saved them as read or unread.
<img src="./screenshots/mangareaderapp-chapterlist.jpg" width="280" height="500"/>

## Reading screen
> Possibility to zoom on page images (see 
[@dudigital/react-native-zoomable-view](https://github.com/DuDigital/react-native-zoomable-view))
<img src="./screenshots/mangareaderapp-reading.jpg" width="280" height="500"/>
<img src="./screenshots/mangareaderapp-reading-zoom.jpg" width="280" height="500"/>
