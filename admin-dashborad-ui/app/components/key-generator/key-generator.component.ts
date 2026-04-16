import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneratedKey, Client } from '../../../models/types';
import { format, parseISO } from 'date-fns';
import { AlertService } from '../../../services/alert.service';

export interface ModuleNode {
  id: number;
  label: string;
  type: string;
  sortOrder: number;
  children: ModuleNode[];
  selected?: boolean;
  expanded?: boolean;
  indeterminate?: boolean;
}

const MODULE_HIERARCHY: ModuleNode[] =
  [
    {
      "id": 14096,
      "label": "Dashboard",
      "type": "module",
      "sortOrder": 0,
      "children": [
        {
          "id": 14097,
          "label": "Main Dashboard",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14098, "label": "Overview", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14099,
      "label": "Unified Sales",
      "type": "module",
      "sortOrder": 1,
      "children": [
        {
          "id": 14100,
          "label": "Sales",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14101, "label": "Make Sale", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14102, "label": "Sale Report", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14103,
      "label": "Garment Store",
      "type": "module",
      "sortOrder": 2,
      "children": [
        {
          "id": 14104,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14105, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14106, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14107,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14108, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14109,
      "label": "Footwear Store",
      "type": "module",
      "sortOrder": 3,
      "children": [
        {
          "id": 14110,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14111, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14112, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14113,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14114, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14115,
      "label": "Auto Parts",
      "type": "module",
      "sortOrder": 4,
      "children": [
        {
          "id": 14116,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14117, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14118, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14119,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14120, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14121,
      "label": "Furniture Store",
      "type": "module",
      "sortOrder": 5,
      "children": [
        {
          "id": 14122,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14123, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14124, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14125,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14126, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14127,
      "label": "Optical Store",
      "type": "module",
      "sortOrder": 6,
      "children": [
        {
          "id": 14128,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14129, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14130, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14131,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14132, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14176,
      "label": "Pharmacy Store",
      "type": "module",
      "sortOrder": 7,
      "children": [
        {
          "id": 14177,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14178, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14179, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14202, "label": "Expiry Report", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14180,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14181, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        },
        {
          "id": 14198,
          "label": "Doctors",
          "type": "submodule",
          "sortOrder": 3,
          "children": [
            { "id": 14199, "label": "Create Doctor", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14200, "label": "Doctor List", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14201, "label": "Doctor Wise Sale", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14182,
      "label": "Sports Shop",
      "type": "module",
      "sortOrder": 8,
      "children": [
        {
          "id": 14183,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14184, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14185, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14186,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14187, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14133,
      "label": "Supermarket",
      "type": "module",
      "sortOrder": 9,
      "children": [
        {
          "id": 14134,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14135, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14136, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14137,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14138, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14139,
      "label": "Electronics",
      "type": "module",
      "sortOrder": 10,
      "children": [
        {
          "id": 14140,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14141, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14142, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14143,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14144, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14145,
      "label": "Mobile Phone Shop",
      "type": "module",
      "sortOrder": 11,
      "children": [
        {
          "id": 14146,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14147, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14148, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14149,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14150, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14151,
      "label": "Apparel Outlet",
      "type": "module",
      "sortOrder": 12,
      "children": [
        {
          "id": 14152,
          "label": "Inventory",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14153, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14154, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14155,
          "label": "Settings",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14156, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14157,
      "label": "Contacts",
      "type": "module",
      "sortOrder": 13,
      "children": [
        {
          "id": 14158,
          "label": "Customers",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14159, "label": "View", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14160, "label": "Manage", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14161,
          "label": "Suppliers",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14162, "label": "View", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14163, "label": "Manage", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14164,
      "label": "System & Accounts",
      "type": "module",
      "sortOrder": 14,
      "children": [
        {
          "id": 14165,
          "label": "Accounts",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14166, "label": "Party Statement", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14167, "label": "Balance Due", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14168, "label": "Cheque Summary", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14169,
          "label": "User Management",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14170, "label": "Manage Access", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14171,
      "label": "System Setting",
      "type": "module",
      "sortOrder": 15,
      "children": [
        { "id": 14172, "label": "Sales Settings", "type": "tab", "sortOrder": 1, "children": [] },
        { "id": 14173, "label": "Formate Editor", "type": "tab", "sortOrder": 2, "children": [] },
        { "id": 14174, "label": "Hsn Master", "type": "tab", "sortOrder": 3, "children": [] },
        { "id": 14175, "label": "Version Control", "type": "tab", "sortOrder": 4, "children": [] },
        { "id": 14203, "label": "UPI Configuration", "type": "tab", "sortOrder": 5, "children": [] }
      ]
    },
    {
      "id": 14188,
      "label": "Barcode Designer",
      "type": "module",
      "sortOrder": 16,
      "children": [
        {
          "id": 14189,
          "label": "Designer",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14190, "label": "Template Designer", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14191, "label": "Saved Templates", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14192, "label": "Product Barcode Master", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14193,
      "label": "Reports",
      "type": "module",
      "sortOrder": 17,
      "children": [
        {
          "id": 14194,
          "label": "GST AND TAX REPORTS",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14195, "label": "B2B", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14196, "label": "B2C", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14197, "label": "HSN SUMMARY", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14204,
          "label": "BUSINESS REPORTS",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14205, "label": "SUPPLIER WISE SALE REPORT", "type": "tab", "sortOrder": 1, "children": [] }
          ]
        }
      ]
    }
  ];



@Component({
  selector: 'app-key-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './key-generator.component.html',
  styleUrls: ['./key-generator.component.css']
})
export class KeyGeneratorComponent {
  @Input() generatedKeys: GeneratedKey[] = [];
  @Input() clients: Client[] = [];
  @Output() onGenerateKey = new EventEmitter<Omit<GeneratedKey, 'id' | 'generatedAt'>>();

  moduleHierarchy: ModuleNode[] = JSON.parse(JSON.stringify(MODULE_HIERARCHY)); // Deep clone so multiple renders don't conflict

  selectedClientId: string = '';
  plan: string = '';
  expirationDate: string = '';
  copiedKey: string | null = null;
  selectedModules: any[] = [];

  constructor(private alertService: AlertService) { }

  toggleNodeExpand(node: ModuleNode): void {
    node.expanded = !node.expanded;
  }

  onNodeSelectionChange(node: ModuleNode): void {
    // Cascade selection down
    this.cascadeSelection(node, !!node.selected);
    // Recalculate parents up
    this.updateParentSelectionStates(this.moduleHierarchy);
  }

  cascadeSelection(node: ModuleNode, isSelected: boolean): void {
    node.selected = isSelected;
    node.indeterminate = false;
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => this.cascadeSelection(child, isSelected));
    }
  }

  updateParentSelectionStates(nodes: ModuleNode[]): void {
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        this.updateParentSelectionStates(node.children);

        const allSelected = node.children.every(child => child.selected);
        const someSelected = node.children.some(child => child.selected || child.indeterminate);

        node.selected = allSelected;
        node.indeterminate = someSelected && !allSelected;
      }
    });
  }

  buildSelectedTree(nodes: ModuleNode[]): any[] {
    const result: any[] = [];
    for (const node of nodes) {
      if (node.selected || node.indeterminate) {
        const copy: any = {
          id: node.id,
          label: node.label,
          type: node.type,
          sortOrder: node.sortOrder,
          children: []
        };
        if (node.children && node.children.length > 0) {
          copy.children = this.buildSelectedTree(node.children);
        }
        result.push(copy);
      }
    }
    return result;
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  generateRandomKey(plan: string, company: string): string {
    const planPrefix = plan.substring(0, 3).toUpperCase();
    const companyPrefix = (company || 'UNKNOWN')
      .substring(0, 4)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    const year = new Date().getFullYear();
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${planPrefix}-${companyPrefix}-${year}-${randomString}`;
  }

  getSelectedClient(): Client | undefined {
    return this.clients.find(c => c.id === this.selectedClientId);
  }

  getClientDisplayName(client: Client | undefined): string {
    return client?.companyName || 'Unknown Client';
  }

  handleGenerate(): void {
    const selectedModules = this.buildSelectedTree(this.moduleHierarchy);
    const selectedClient = this.getSelectedClient();
    const displayName = this.getClientDisplayName(selectedClient);

    if (!this.selectedClientId) {
      this.alertService.warning('Please select a client');
      return;
    }

    if (!this.plan || !this.expirationDate) {
      this.alertService.warning('Please fill in all required fields');
      return;
    }

    if (selectedModules.length === 0) {
      this.alertService.warning('Please select at least one module or attribute');
      return;
    }

    const key = this.generateRandomKey(this.plan, displayName);
    this.selectedModules = selectedModules; // Keep track of generated output if UI wants to bind later

    // Emit both the key data and the clientId
    this.onGenerateKey.emit({
      key,
      clientId: this.selectedClientId,
      companyName: displayName,
      plan: this.plan,
      expirationDate: this.expirationDate,
      modules: selectedModules,
      email: selectedClient?.email || '',
      contactNumber: selectedClient?.contactNumber || '',
      contactPerson: selectedClient?.contactPerson || '',
      address: selectedClient?.address || '',
    } as any);

    // Reset form
    this.resetForm();
  }

  resetForm(): void {
    this.selectedClientId = '';
    this.plan = '';
    this.expirationDate = '';
    this.moduleHierarchy = JSON.parse(JSON.stringify(MODULE_HIERARCHY)); // Reset hierarchy clone
  }

  handleCopyKey(key: string): void {
    navigator.clipboard.writeText(key).then(() => {
      this.copiedKey = key;
      setTimeout(() => (this.copiedKey = null), 2000);
    });
  }

  formatDate(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  }

  formatDateTime(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  }

  formatTimeAgo(dateString: string): string {
    try {
      const date = parseISO(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);

      if (diffInMinutes < 1) return 'just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h ago`;
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays}d ago`;

      return format(date, 'MMM dd');
    } catch {
      return dateString;
    }
  }

  getRemainingDays(expirationDate: string): number {
    try {
      const expDate = parseISO(expirationDate);
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 0;
    }
  }

  getExpirationStatus(expirationDate: string): 'expired' | 'expiring-soon' | 'active' {
    const days = this.getRemainingDays(expirationDate);
    if (days < 0) return 'expired';
    if (days <= 30) return 'expiring-soon';
    return 'active';
  }

  getExpirationStatusClass(expirationDate: string): string {
    const status = this.getExpirationStatus(expirationDate);
    if (status === 'expired') return 'text-red-600 font-bold';
    if (status === 'expiring-soon') return 'text-amber-600 font-bold';
    return 'text-green-600 font-bold';
  }

  getExpirationText(expirationDate: string): string {
    const days = this.getRemainingDays(expirationDate);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires Today';
    if (days === 1) return 'Expires Tomorrow';
    return `${days} days remaining`;
  }
}



