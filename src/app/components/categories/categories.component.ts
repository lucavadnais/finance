import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthProvider} from "../../providers/auth/auth.provider";
import {CategoryProvider} from "../../providers/category.provider";
import {Category} from "../../models/transaction.model";
import {NgForOf, NgIf} from "@angular/common";
import {BottomSheetService} from "../../services/bottom-sheet.service";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  user: User | null = null;

  categories: Category[] = [];
  filteredCategories: Category[] = [];
  subCategories: Category[] = [];

  @Input() selectedCategory: Category | null = null;
  @Output() parentCategory = new EventEmitter<string>();
  @Output() categorySelected = new EventEmitter<Category>();

  constructor(
    private bottomSheetService: BottomSheetService,
    private authProvider: AuthProvider,
    private categoryProvider: CategoryProvider,
  ) {

  }

  ngOnInit() {
    this.user = JSON.parse(this.authProvider.getToken());
    this.fetchPageContent();
  }


  fetchPageContent() {
    Promise.all([this.getUserCategories()]).then((res:any) => {
      this.categories = res[0];
      this.categories = this.categories.map((category: Category) => {
        if (category.parentId) {
          this.categories.find((parent: Category) => {
            if (parent._id === category.parentId) {
              if (!parent.children) {
                parent.children = [];
              }
              parent.children.push(category);
            }
          });
        }
        return category;
      }).filter((category: Category) => {
        return !category.parentId;
      }).sort((a: Category, b: Category) => {
        return a.name.localeCompare(b.name);
      });
      this.filteredCategories = this.categories;
      if (this.selectedCategory?.parentId){
        this.selectCategory(this.categories.find((category: Category) => category._id === this.selectedCategory?.parentId)!);
      }
    }).catch(err => {
      console.error(err);
    });
  }

  getUserCategories() {
    return new Promise((resolve, reject) => {
      this.categoryProvider.getUserCategories(this.user!._id).then((res: any) => {
        resolve(res);
      }).catch(err => {
        reject(err);
      });
    });
  }

  backToCategories() {
    document.getElementById('sub-categories-container')!.classList.remove('show-subcategories');
    document.getElementById('sub-categories-container')!.classList.add('hide-subcategories');
    document.getElementById('categories-container')!.classList.add('show-categories');
    this.selectedCategory = null;
    this.subCategories = [];
    this.parentCategory.emit('');
    this.filteredCategories = this.categories;
  }

  selectCategory(category: Category) {
    if (category.children) {
      document.getElementById('categories-container')!.classList.remove('show-categories');
      document.getElementById('categories-container')!.classList.add('hide');
      document.getElementById('sub-categories-container')!.classList.add('show-subcategories');
      this.parentCategory.emit(category.name);
      this.subCategories = category.children;
      return;
    }
    this.selectedCategory = category;
    this.categorySelected.emit(category);
  }
}
