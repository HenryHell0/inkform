for this undo-redo fix thing:
- make z-index only trigger an action when the view actually changes
      - also zindex should update on drag
      - and zindex should update when pointerdown, not pointerup
- make moveWidetAction and ResizeWidgetAction NOT need a "before" property (potentially just extend editWidgetAction)
- group moveWidgetAction with ImportExpressionToGraphAction so that it doesen't sit on the graph when you drop it. I may be able to like hack it and just delete the moveWidgetAction or something... or undo it? we'll see

## THE PLAN!!!:

TODO TODO WEE WOO WEE WOO fix POPMENU Z INDEX


### General


- 🔗 add save/load
- Improve SEO (alt text and stuff)
- 📷 infinite pannable camera
     - grab icon panning tool
     - home icon tool that bring you to original position
     - spacebar on laptop
- 🗼 make a robust way to represent expressions with promises so the user can graph/solve them before they load
- 😄 make intro dialog with GIFs!!!!!!!
- ⚙️  add different settings for the tools that pop down in a different menu (stoke width, color, etc. ) - make it cute
- ⭐ switch HMER select button to having a little AI star
- make a logo

### Later:

- consider making it so that you can select a portion of the graph to set the bounds
Analytics:
Once you get users:
Track custom events:
      “Converted handwriting”
      “Created graph”
      “Exported LaTeX”
Now you can say:
      “Users converted 3,482 math expressions.”


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

for this undo-redo fix thing:
- change graph colors
- add(import?) expression to graph
- future "change" expression (like solving it or editing it. Action.before & Action.after) (also this will be used with Partials in TS and be useful for graph colors)
- turn graph back into expression
- remove expression from graph
