from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel


class CalcRequest(BaseModel):
	a: float
	b: float
	op: str


app = FastAPI(title="Calculator API")

base_dir = Path(__file__).resolve().parent
static_dir = base_dir / "static"

app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
def index() -> FileResponse:
	return FileResponse(static_dir / "index.html")


@app.post("/api/calc")
def calculate(payload: CalcRequest) -> dict:
	a = payload.a
	b = payload.b
	op = payload.op

	if op == "+":
		result = a + b
	elif op == "-":
		result = a - b
	elif op == "*":
		result = a * b
	elif op == "/":
		if b == 0:
			raise HTTPException(status_code=400, detail="Division by zero is not allowed")
		result = a / b
	else:
		raise HTTPException(status_code=400, detail="Invalid operator. Use one of: +, -, *, /")

	return {
		"a": a,
		"b": b,
		"op": op,
		"result": result,
	}