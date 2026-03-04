## THE PLAN!!!:

Issues to create:
bug fixes:
- 🖼️ make widgets display properly on mobile - tags: bugfix, mobile
- 🖌️ fix toolbar styles on mobile - tags: bugfix, mobile
- ↩️ add actions for widget functions so undo/redo works throughout - tags: bugfix, feature

style/UI:
- make it so that hovering a graph with an expression blurs/makes it clear you can drop it in. noone will know you can do that. - also potentially make a better drag/drop architecture - tags: UI, feature
- ℹ️  add info button that shows a dialog of info about myself etc... - figure out a better dialog system - feature

architecture/refactor:
- 🗨️ implement new scalable dialog architecture - tags: refactor, architecture? (maybe find a better synonym for architecture to represent things like this, maybe API or utility something idk)

further development:
- implement google analytics - feature


### General

- 🔗 add save/load
- ℹ️  add info button that shows a dialog of info about myself etc... - figure out a better dialog system
- ❌ right now you can't exit the feedback dialog. either add an X button OR make it so clicking the background closes it
- 🖊️ editable expression component!
     - AND make it so you can put expressions back into text, and it'll scale down what you wrote to fit the resized expression (this means storing the size of the original cutout and paths deleted in the expression, converting the paths back into strokes, and then finding x and scale factors and looping through the strokes, scaliong down and adusting position accordinly. Should be fun!!!)
- 📷 infinite pannable camera
     - grab icon panning tool
     - home icon tool that bring you to original position
     - spacebar on laptop
- 🗼 make a robust way to represent expressions with promises so the user can graph/solve them before they load
- 😄 make intro dialog with GIFs!!!!!!!
- ⚙️  add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute
- ⭐ switch HMER select button to having a little AI star
- implement better drag and drop system for graphs and stuff
- make it so that hovering a graph with an expression blurs/makes it clear you can drop it in. noone will know you can do that.
- make a logo

### Later:

- consider making it so that you can select a portion of the graph to set the bounds
- Add to Google Analytics:
  “Converted handwriting”
  “Created graph”
  “Exported LaTeX”
  Now you can say:
  “Users converted 3,482 math expressions.”

PS

### DONE:

- 🔨 refactor toolbar
- 🖌️ add global color scheme with :root so its nice and easy
- ↩️ add undo/redo
- make undo/redo work with erasing!!
- 📞 make it work on phones
- make widget toolbar clickable on mobile!! (touch not registering)
- 🐱 add github icon that links to the github page
- refactor widget movement/selection system
- 🧰 refactor widgets big time!!!! (aah!!)
     - 😜 refactor widgets to organize and follow best pracitces of like vue architecture organization... --- NOTE: tf does this mean

