# Needs verification

Wording in the site content that **may be wrong and must be checked against a source before anyone changes it**.
It is kept exactly as the old (2013-era) website had it unless noted. Do not "fix" these from memory or by guessing.

**Best source:** the Melrose Beacon, 1908-2008, digitized and searchable at the museum (Research Center). The May 1949
issues should settle most of the Gallagher items.

**How to resolve an item:** verify it, edit the story file listed, delete the item from this file, and say what the source
was in the commit message. Items must stay listed here until then.

Last updated: October 2026.

---

## 1. "F-882 fighter planes" (parade)

- **Where:** `src/content/stories/military.md` → "Capt. James Gallagher" subsection, second paragraph
- **Current text:** "…rode in an open car as **F-882 fighter planes** did acrobatics overhead."
- **Concern:** there is no aircraft with this designation. It may be the **F-82 Twin Mustang**, a fighter in Air Force service
  in 1949, but that is a guess and could also be a different type or a typo for a number of planes.
- **Evidence so far:** none found online about the Melrose parade itself.
- **To verify:** the Melrose Beacon, May 1949 (the parade followed the flight).
- **Proposed fix once confirmed:** replace with the correct aircraft type or count.

## 2. Flight duration vs. average speed

- **Where:** `src/content/stories/military.md` → "Capt. James Gallagher" subsection, first paragraph
- **Current text:** "Total air time was **78 hours 54 minutes**; average **249 miles per hour**."
- **Concern:** the two figures disagree. Air Force sources describe the flight as **94 hours 1 minute** over **23,452 miles**,
  which averages about 249 mph. 78 h 54 min at 249 mph would be only ~19,600 miles. The 78:54 figure looks like an error.
- **Evidence:**
  - [Lucky Lady II (Wikipedia)](https://en.wikipedia.org/wiki/Lucky_Lady_II)
  - [Lucky Lady II (Air & Space Forces Magazine)](https://www.airandspaceforces.com/article/0399lucky/)
  - [26 Feb 1949 (Air Force Historical Foundation)](https://afhistory.org/26-feb-1949/)
- **To verify:** Beacon article of March 1949, or the Air Force sources above.
- **Proposed fix once confirmed:** "Total air time was 94 hours 1 minute; average 249 miles per hour."

## 3. Aircraft name

- **Where:** `src/content/stories/military.md` (several mentions of "Lucky Lady"), `src/data/home.json` (story card), `src/data/timeline.json`
- **Current text:** "Lucky Lady"
- **Concern:** published sources name the 1949 aircraft **Lucky Lady II**. The short form "Lucky Lady" may simply be what the
  community called it at the time.
- **To verify:** how the Beacon referred to it. Decide whether to keep the local usage or use the formal name.
- **Proposed fix once confirmed:** use "Lucky Lady II" at least on first mention.

## 4. "22nd anniversary of Lindbergh's landing in Paris"

- **Where:** `src/content/stories/military.md` → Gallagher subsection, second paragraph
- **Current text:** "May 20 (coincidentally the 22nd anniversary of Lindbergh's landing in Paris)"
- **Concern:** the original website said "the 22nd year of Lindbergh's landing in Paris". It was lightly reworded during
  migration. Lindbergh **took off** from New York on May 20, 1927 and **landed** in Paris on May 21, so May 20 is the
  anniversary of the *takeoff*.
- **To verify:** the date of the caravan (Beacon, May 1949) and the intended meaning.
- **Proposed fix once confirmed:** "…the 22nd anniversary of Lindbergh's takeoff for Paris" (if the caravan was May 20), or
  correct the date.

## 5. St. Patrick's convent sentence

- **Where:** `src/content/stories/convents.md` → third paragraph
- **Current text:** "St. Patrick's Church also had a convent **in** a large home built by pioneer resident Peter Pallansch."
- **Concern:** the original read "also had a convent large home built by pioneer resident Peter Pallansch", which is
  ungrammatical. "in" was inserted during migration as the likeliest meaning; it could instead mean the sisters lived in a
  large home that Pallansch had built, or something else.
- **To verify:** ask someone at the Society who knows the building's history, or the Beacon / parish records.
- **Proposed fix once confirmed:** rewrite to the confirmed facts.

## 6. Figures and claims on the war exhibit signs

The military story summarizes the museum's own exhibit signs. These claims on the signs look questionable, so the summary
either omits them or leaves them out of the site text. Verify before adding them back.

- **WWII sign:** "Hitler's determination to take over Europe, **beginning in 1926**" (he became Chancellor in 1933) and
  "about **150 million** people were victims" (commonly cited deaths are roughly 70-85 million). Both omitted from the site.
- **Spanish-American War sign:** "the Spanish sank the U.S.S. Maine" (the cause of the explosion was never conclusively
  established) and "American losses numbered **460**" (battle deaths and total deaths are often reported differently).
  The site says only that the Maine "was sunk".
- **Vietnam sign:** "total fatalities were **220,069**"; **Korean sign:** "more than 3 million killed or made homeless";
  **Gulf War sign:** "total U.S. battle deaths, 148". None of these figures are on the site.
- **Dates in the headings** (e.g. WWII 1939-1945, Korea 1950-1953, Vietnam 1965-1975) were added from general knowledge, not the signs.

## 7. Main Street Businesses story is a placeholder

- **Where:** `src/content/stories/local-businesses.md`
- **Status:** a short, general introduction written from what is visible in one photo (Swany White Bakery sign, Bohlig
  Cleaners banner, Herges Speedy Delivery Grocery jacket, Dayton scale, cash registers). It names no dates, owners or
  addresses on purpose.
- **To do:** the owner plans to flesh it out with real histories of these businesses. Do not add facts without a source.

## 8. Linotype story: local history of this machine

- **Where:** `src/content/stories/linotype.md`
- **Status:** the story explains how a Linotype works (general knowledge) and says Melrose Beacon-type papers relied on such
  machines. It does **not** claim this machine was the Beacon's.
- **Concern:** a small framed photo beside the machine appears to be captioned with a date in June and the words "Linotype moved
  from ... Melrose Beacon office" plus several names, but the text is too small to read reliably in the photo.
- **To verify:** read that caption in person; then add when and from where the machine came, and who moved it.

## 9. New display stories written from photos (train station, sports, toys)

Short placeholder introductions written only from what is visible; they contain no dates, owners or local claims. Fill in
with real history when available.

- `src/content/stories/train-station.md`: names Great Northern and Burlington Northern from the memorabilia. The display
  mentions a roundhouse plan (Sanborn map) and "G.N. yards, Melrose" photos; the town's actual rail history is not written.
- `src/content/stories/sports.md`: the display has Olympic/Team USA items and a label naming **Jan Niehaus Herke** and
  **Jan Ettle** with "recognition posters for pro women athletes 2019". The story does not name anyone or say which local
  athletes competed. **Confirm who is honored, in what sport, and add them.**
- `src/content/stories/toys-games.md`: lists only items visible in the case.

---

## Checked and resolved (kept for reference)

| Item | Resolution |
|---|---|
| "Wapeton Dakota" (`native-americans.md`) | Changed to **Wahpeton**, the standard spelling (Waȟpéthuŋwaŋ, "Leaf Village"). Owner approved, October 2026. |
| Building acquisition: 1998 gift vs. 2000 lease (`convents.md`, `about-history.md`, `timeline.json`) | Owner confirmed the **2000 acquisition and lease** account is correct. The Convents story and the timeline were changed to match the About history paragraph (October 2026). |
| "Malmo focus … Middle Woodland Period, roughly 300 to 1000 A.D." (`native-americans.md`) | Checked. The date range matches the Central Minnesota Transitional Woodland chronology, and the Malmo name comes from the Mille Lacs site. No change needed. |
| Typos corrected during migration | Walter Haut, August Kuhlmann, *Spirit* of St. Louis, Chronicle, Fort Worth, Woodland Period, Hetzel, Lake Wobegon. |
