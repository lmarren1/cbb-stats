import pdfplumber
import csv

file_path_fh = "first_half.txt"

formatted_line = [["time", "action", "player", "home_or_away", "description", "score"]]

with open(file_path_fh, "r") as file:
    for line in file:
        line = line.strip()
        if line:
            play = line.split()
            print(f"\nOG play: {play}\n")
            
            time = ""
            action = ""
            player = ""
            description = ""
            score = ""
            home_or_away = ""
            i = 0

            # If away is first, the capitalized action will come first.
            if play[i].isupper():
                home_or_away = "away"

                # PLAY ... "by" NAME(desc) TIME (potentially --) SCORE (maybe) then omit margin stuff

                # Action is variable length, so we iterate until the word "by".
                for s in play:
                    i += 1
                    if s == "by":
                        action = action.strip()
                        break
                    action += s
                    action += " "

                # Name and Description (if it exists).
                # loop through Name and Description until you hit time (has no alphabet letters)
                while any(char.isalpha() for char in play[i]):
                    for letter in play[i]:
                        if letter.isupper() or letter.isnumeric() or letter == ".":
                            player += letter
                        elif letter == ",":
                            player += " "
                        else:
                            description += letter
                    i += 1
                    # If there's a description present and the next part of the line is more description, add a space.
                    if len(description) > 0 and play[i][0].isalpha():
                        description += " "
                description = description.replace("(", "").replace(")", " ").strip()

                # If line has "--" for time, then time is the same as the last line's.
                if play[i] == "--":
                    time += formatted_line[-1][0]

                # If there is a time, record it and the score and leave the rest of the line.
                else:
                    time += play[i]
                    i += 1
                    if i < len(play):
                        score += play[i]

            # TIME SCORE (maybe) Margin (cap letter) (number) PLAY ... "by" NAME(desc)
            # -- (means same time as last) PLAY ... "by" NAME(desc)

            # If home team action
            else:
                home_or_away = "home"

                # If starts with same time as last.
                if play[0] == "--":
                    time += formatted_line[-1][0]
                    i += 1

                # Else, it starts with a new time.
                else:
                    time += play[0]
                    i += 1
                    # If there's a score, add it.
                    if play[i][0].isnumeric():
                        score += play[i]
                        i += 1

                # Action is variable length, so we iterate until the word "by".
                for j in range(i, len(play)):
                    if play[j] == "by":
                        i = j + 1
                        action = action.strip()
                        break
                    action += play[j] + " "

                # loop through Name and Description until you hit time (has no alphabet letters)
                while i < len(play) and any(char.isalpha() for char in play[i]):
                    for letter in play[i]:
                        if letter.isupper() or letter.isnumeric():
                            player += letter
                        elif letter == ",":
                            player += " "
                        else:
                            if letter.isalpha():
                                description += letter
                    i += 1
                    if i < len(play) and len(description) > 0 and play[i][0].isalpha():
                        description += " "

            formatted_line.append(
                [time, action, player, home_or_away, description, score]
            )
            print(
                f"\n(time, action, player, home_or_away, description, score)\nfinished product: {formatted_line[-1]}\n"
            )

file_path_fh_csv = "first_half.csv"

with open(file_path_fh_csv, "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerows(formatted_line)