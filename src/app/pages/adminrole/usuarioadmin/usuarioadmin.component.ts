import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { error } from 'console';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import Swal from 'sweetalert2';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UserService, User } from '../../../core/services/users.service';

@Component({
  selector: 'app-usuarioadmin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './usuarioadmin.component.html',
  styleUrl: './usuarioadmin.component.scss',
})
export class UsuarioadminComponent implements OnInit {
  users: User[] = [];
  dataSource = new MatTableDataSource<User>();
  searchText: string = '';
  searchField: string = 'names';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource.data = users;
    });
  }

  displayedColums: string[] = [
    'idCard', //Verificar puede ser idCard
    'names',
    'lastName',
    'email',
    'phone',
    //'actions'
  ];

  applyFilter(): void {
    const normalizeSearch = this.normalizeText(this.searchText);
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const field = data[this.searchField as keyof User] as string | number;
      return this.normalizeText(field?.toString() || '').includes(filter);
    };
    this.dataSource.filter = normalizeSearch;
  }
  private normalizeText(text: string): string {
    return text
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
