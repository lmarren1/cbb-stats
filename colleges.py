import csv

list_of_lists = []

with open("colleges.txt", "r") as file:
    lines = file.readlines()
    lines = [line.strip() for line in lines]
    list_of_lists = [lines[i:i + 5] for i in range(0, len(lines), 5)]

with open("colleges.csv", "w", newline='') as file:
    writer = csv.writer(file)
    writer.writerows(list_of_lists)