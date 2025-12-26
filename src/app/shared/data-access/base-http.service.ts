import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {

  http = inject(HttpClient);
  apiSienteUrl = environment.API_URL;
  
}
