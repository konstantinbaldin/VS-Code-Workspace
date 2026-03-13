from datetime import datetime
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


ACTIVITIES = ["Inglês", "Música", "Ginástica", "Teatro", "Natação"]


class ActivityUpdate(BaseModel):
    status: Literal["present", "absent"]
    mood: Literal["feliz", "normal", "cansado"] = "normal"
    note: str = Field(default="", max_length=500)


app = FastAPI(title="Dino Pre-School Tracker")

base_dir = Path(__file__).resolve().parent
static_dir = base_dir / "dino_static"

app.mount("/static", StaticFiles(directory=static_dir), name="static")

state = {
    "child_name": "Meu Filho",
    "week_start": datetime.now().date().isoformat(),
    "records": {
        activity: {
            "activity": activity,
            "status": "present",
            "mood": "normal",
            "note": "",
            "updated_at": None,
        }
        for activity in ACTIVITIES
    },
}


@app.get("/")
def index() -> FileResponse:
    return FileResponse(static_dir / "index.html")


@app.get("/api/activities")
def list_activities() -> dict:
    return {"activities": ACTIVITIES}


@app.get("/api/week")
def get_week() -> dict:
    return {
        "child_name": state["child_name"],
        "week_start": state["week_start"],
        "records": list(state["records"].values()),
    }


@app.put("/api/week/{activity}")
def update_activity(activity: str, payload: ActivityUpdate) -> dict:
    if activity not in state["records"]:
        raise HTTPException(status_code=404, detail="Activity not found")

    state["records"][activity].update(
        {
            "status": payload.status,
            "mood": payload.mood,
            "note": payload.note.strip(),
            "updated_at": datetime.now().isoformat(timespec="seconds"),
        }
    )

    return {"ok": True, "record": state["records"][activity]}
