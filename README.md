# Athletics Application
## Current state
### Login
| Feature | Is Implemented | Does Work
| ------- | -------------- | --------- |
| Login via Email | false |  |
| Login via Google | true | true |
| Login via Discord | true | true |

### Account
| Feature | Is Implemented | Does Work |
| ------- | -------------- | --------- |
| New Personal Info | true | true |
| Update Personal Info | true | true |
| Remove Personal Info | false |  |
|
| New Race | true | true |
|
| Change Role Management | true | partially - account menu doesn't devalidate |
| Racer Role | true | true |
| Event Manager Role | true | true |
| Race Manager Role | true | partially - role change to admin visible |
| Admin Role | true | true |
|
| New Event | true | true |
| New Event both genders | true | true |
| Update Event | true | true |
| Remove Event | true | true |
| New Group Event | true | true |
| New Group Event both genders | true | true |
| Update Group Event | true | true |
| Remove Group Event | true | true |
| New Sub Event | true | true |
| Update Sub Event | true | true |
| Remove Sub Event | true | true |
|
| Coeficient Table | true | partially - doesn't sort by age, creating / updateing / removing events / subevents doesn't update table |
| New Coeficient | true | true |
| Update Coeficient | true | partially - null allowed to send, doesn't update |
| Delete Coeficient | true | true |

### Race Admin Panel
| Feature | Is Implemented | Does Work |
| ------- | -------------- | --------- |
| Update Race | true | partially - doesn't update homepage |
| Delete Race | true | true |
|
| Table of Registered Racers | true | true |
| Removing Racers | true | true |
|
| Table of Performances | true | partially - reloads and destroys unsaved |
| Add Event | true | partially - adding new event doesn't update menu |
| Remove Event | true | partially - removing event doesn't update menu |
|
| Add Measurement | true | true |
| Update Measurement | true | true |
| Remove Measurement | true | true |
| Removing Racers from Events | true | true |
| Mixing Racers Order | true | true |
|
| Race Backup | false | false - wrong because old |

### Race Signup
| Feature | Is Implemented | Does Work |
| ------- | -------------- | --------- |
| Signup With Account | true | partially - allows signup when not sign in |
| Change Personal Info in signup | false |  |
| Shows Account Race Signup | false |  |
| Signup Without Account | true | true |

### Race Panel
| Feature | Is Implemented | Does Work |
| ------- | -------------- | --------- |
| Basic Race Overview | true | true |
| Score Table | true | true - not tested on real data |