import { Component } from '@angular/core';
import { JumbotronHome } from './jumbotron-home/jumbotron-home';

@Component({
  selector: 'app-home',
  imports: [JumbotronHome],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export default class Home {

}
