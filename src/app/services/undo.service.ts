import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
const BACKEND_URL = environment.apiUrl + "/undo/";

@Injectable({
  providedIn: "root"
})
export class UndoService {
  constructor(private http: HttpClient) {}

  deleteLatest(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }

  getUndoTasks(id: string) {
    return this.http.get<any>(BACKEND_URL + id);
  }
}
