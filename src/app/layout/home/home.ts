import { Component } from '@angular/core';
import { Footer } from "../../common/footer/footer";
import { Navbar } from "../../common/navbar/navbar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Footer, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
