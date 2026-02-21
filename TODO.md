## THE PLAN!!!:
- make widgets display properly on mobile
- make undo/redo work with erasing!!
- 🗨️ fix dialog architecture 
- 😄 make intro dialog with GIFs!!!!!!!
- 🔗 add save/load
- 🐱 add github icon that links to the github page
- ℹ️ add info button that shows a dialog of info about myself etc... - figure out a better dialog system
- 😜 refactor widgets to organize and follow best pracitces of like vue architecture organization... --- NOTE: tf does this mean


### General

- right now you can't exit the feedback dialog. either add an X button OR make it so clicking the background closes it
- 8 editable expression component!
    - AND make it so you can put expressions back into text, and it'll scale down what you wrote to fit the resized expression (this means storing the size of the original cutout and paths deleted in the expression, converting the paths back into strokes, and then finding x and y scale factors and looping through the strokes, scaliong down and adusting position accordinly. Should be fun!!!)
- 6 infinite pannable camera 
    - grab icon panning tool
    - home icon tool that bring you to original position
    - spacebar on laptop
- 4 make a robust way to represent expressions with promises so the user can graph/solve them before they load
- 2 add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute
- 1 switch HMER select button to having a little AI star

### Graphs:

- 6 make it so that hovering a graph with an expression blurs/makes it clear you can drop it in. noone will know you can do that.
- also consider (later) making it so that you can select a portion of the graph to set the bounds


### Other Stuff:
- Add to Google Analytics:
    “Converted handwriting”
    “Created graph”
    “Exported LaTeX”
    Now you can say:
    “Users converted 3,482 math expressions.”


### DONE:
- 🔨 refactor toolbar
- 🖌️ add global color scheme with :root so its nice and easy 
- ↩️ add undo/redo
- 📞 make it work on phones
- make widget toolbar clickable on mobile!! (touch not registering)
