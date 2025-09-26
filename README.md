## Record History for Arcade Games

https://a3-oliviaolsen.onrender.com

The goal of this app was to allow users to track records on old arcade games within a friendgroup. These are old games, and records usually take years, so it's divided by years, although in hindsight I should have included full dates.

Adding the login functionality took a LOT of time. I'm extremely thankful I didn't choose to do oAuth, because I chose a really basic method and it still wound up taking me almost 6 hours to get the login working. Hopefully it's sufficiently secure.

I chose implementing my own method of basic username and password, similar to what was outlined in class because the note about oAuth being hard scared me.

I used Tailwind! It didn't really have much preset stuff, but it made my own customization and design choices a lot easier. It's still basic, but none of it looks like standard HTML anymore in my opinion. I'm especially proud of the login page, that one took a while.

I basically just used the built-in ones, express.json and express.static. These allowed to to parse json and serve static files from a directory(public), respectively.

## Technical Achievements
- **Tech Achievement 1**: I got 100% on all the lighthouse tests, as shown by the included reports in the repo.

### Design/Evaluation Achievements
- **Design Achievement 1**: I followed the following tips from the W3C Web Accessibility Initiative:
  
**1. Provide informative, unique page titles**
Both pages have descriptive titles.

**2. Use headings to convey meaning and structure**
All sections have headings, from the main page having an overall heading, to each record type having its own heading, to both the login and change username functions having headings(that I'm much more proud of the stylization of)

**3. Provide clear instructions**
I changed the subheader to be a short set of instructions which briefly explains how to begin using the tool.

**4. Keep content clear and concise**
All content has been labeled, and the instructions are quick and to-the-point.

**5. Provide sufficient contrast between foreground and background**
After significant tinkering with the contrast, the green on black passes the provided web design color scheme tests.

**6. Ensure that interactive elements are easy to identify**
All buttons and inputs were given unique stylization in tailwind, allowing them to stand out from the parts of the page that are uninteractable text.

**7. Provide clear and consistent navigation options**
The only navigation option in this program was the Login button in the upper right, a very common placement on all websites. Additionally, like many sites, when signed in, the button's text becomes, "Hi, User", which should be familiar to most web users.

**8. Ensure that form elements include clearly associated labels**
All form elements have placeholder text that states exactly what the expected input is.

**9. Help users avoid and correct mistakes**
Rather than just doing nothing, if a login has the incorrect password, an alert will appear notifying the user it has failed. Additionally, if a user creates a new account, it will notify them in case they didn't intend to so that they can go back and switch to their intended account.

**10. Reflect the reading order in the code order**
All HTML code is ordered the same as if the user was reading the page top to bottom, left to right.

**11. Identify page language and language changes**
The html lang=en tag is included as instructed.

**12. Associate a label with every form control**
For the only form control that is not already acccounted for with placeholder text, the checkbox, there is a descriptive label.
