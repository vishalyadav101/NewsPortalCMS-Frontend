import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PublicHeader } from '../../shared/public-header/public-header';
import { PublicNavbar } from '../../shared/public-navbar/public-navbar';
import { BreakingNews } from '../../shared/breaking-news/breaking-news';
import { PublicFooter } from '../../shared/public-footer/public-footer';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [RouterOutlet, PublicHeader, PublicNavbar, BreakingNews, PublicFooter],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {}
