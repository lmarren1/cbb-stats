import pdfplumber
import csv

pdf_file_path = "northpark-lawrence-24-data.pdf"

extracted_text = []

with pdfplumber.open(pdf_file_path) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            extracted_text.append(text)

all_text = "\n".join(extracted_text)
print(all_text)
lines = all_text.splitlines()

first_half = []
second_half = []
ot = []
append_to_fh = False
append_to_sh = False
append_to_ot = False

i = 0

while i < len(lines):
    if "1st Half Play By Play" in lines[i]:
        append_to_fh = True
        i += 2
    elif "2nd Half Play By Play" in lines[i]:
        append_to_fh = False
        append_to_sh = True
        i += 2
    elif "OT 1 Play By Play" in lines[i]:
        append_to_sh = False
        append_to_ot = True
        i += 2

    if append_to_fh:
        if lines[i][0].islower():
            first_half[-1] += " "
            first_half[-1] += lines[i]
        else:
            first_half.append(lines[i])
        
    elif append_to_sh:
        if lines[i][0].islower():
            second_half[-1] += " "
            second_half[-1] += lines[i]
        else:
            second_half.append(lines[i])

    elif append_to_ot:
            if lines[i][0].islower():
                ot[-1] += " "
                ot[-1] += lines[i]
            else:
                ot.append(lines[i])

    i += 1

first_half_text = "\n".join(first_half)
second_half_text = "\n".join(second_half)
ot_text = ""

if len(ot) > 0:
    ot_text = "\n".join(ot)
    with open("ot.txt", "w") as text_file:
        text_file.write(ot_text)

with open("first_half.txt", "w") as text_file:
    text_file.write(first_half_text)

with open("second_half.txt", "w") as text_file:
    text_file.write(second_half_text)
