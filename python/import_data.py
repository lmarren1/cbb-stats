import sys
import json
import pandas as pd
from pathlib import Path

try:
    input_data = sys.stdin.read()
    df = pd.DataFrame(json.loads(input_data))

except Exception as e:
    print(str(e), file=sys.stderr)
    sys.exit(1)

actions = pd.read_json(Path('python', 'actions.json'))
games = pd.read_json(Path('python', 'games.json'))
players = pd.read_json(Path('python', 'players.json'))
teams = pd.read_json(Path('python', 'teams.json'))
