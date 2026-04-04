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

const MODULE_HIERARCHY: ModuleNode[] = [
  {
    "id": 0,
    "label": "Dashboard",
    "type": "module",
    "sortOrder": 0,
    "children": [
      {
        "id": 100,
        "label": "Main Dashboard",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 10000, "label": "Overview", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 1,
    "label": "Unified Sales",
    "type": "module",
    "sortOrder": 1,
    "expanded": true,
    "children": [
      {
        "id": 101,
        "label": "Sales",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 10001, "label": "Make Sale", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 10002, "label": "Sale Report", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 2,
    "label": "Garment Store",
    "type": "module",
    "sortOrder": 2,
    "expanded": true,
    "children": [
      {
        "id": 201,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 2001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 2002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 202,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 2003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 3,
    "label": "Footwear Store",
    "type": "module",
    "sortOrder": 3,
    "expanded": true,
    "children": [
      {
        "id": 301,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 3001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 3002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 302,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 3003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 4,
    "label": "Auto Parts",
    "type": "module",
    "sortOrder": 4,
    "expanded": true,
    "children": [
      {
        "id": 401,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 4001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 4002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 402,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 4003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 5,
    "label": "Furniture Store",
    "type": "module",
    "sortOrder": 5,
    "expanded": true,
    "children": [
      {
        "id": 501,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 5001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 5002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 502,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 5003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 6,
    "label": "Optical Store",
    "type": "module",
    "sortOrder": 6,
    "expanded": true,
    "children": [
      {
        "id": 601,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 6001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 6002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 602,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 6003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 7,
    "label": "Pharmacy Store",
    "type": "module",
    "sortOrder": 7,
    "expanded": true,
    "children": [
      {
        "id": 701,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 7001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 7002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 702,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 7003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 8,
    "label": "Sports Shop",
    "type": "module",
    "sortOrder": 8,
    "expanded": true,
    "children": [
      {
        "id": 801,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 8001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 8002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 802,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 8003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 9,
    "label": "Supermarket",
    "type": "module",
    "sortOrder": 9,
    "expanded": true,
    "children": [
      {
        "id": 901,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 9001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 9002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 902,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 9003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 10,
    "label": "Electronics",
    "type": "module",
    "sortOrder": 10,
    "expanded": true,
    "children": [
      {
        "id": 1001,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 10101, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 10102, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 1002,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 10103, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 11,
    "label": "Mobile Phone Shop",
    "type": "module",
    "sortOrder": 11,
    "expanded": true,
    "children": [
      {
        "id": 1101,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 11001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 11002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 1102,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 11003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 12,
    "label": "Apparel Outlet",
    "type": "module",
    "sortOrder": 12,
    "expanded": true,
    "children": [
      {
        "id": 1201,
        "label": "Inventory",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 12001, "label": "Add Product", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 12002, "label": "Product List", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 1202,
        "label": "Settings",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 12003, "label": "General Settings", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 13,
    "label": "Contacts",
    "type": "module",
    "sortOrder": 13,
    "expanded": true,
    "children": [
      {
        "id": 1301,
        "label": "Customers",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 13001, "label": "View", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 13002, "label": "Manage", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      },
      {
        "id": 1302,
        "label": "Suppliers",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 13003, "label": "View", "type": "tab", "sortOrder": 1, "children": [] },
          { "id": 13004, "label": "Manage", "type": "tab", "sortOrder": 2, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 14,
    "label": "System & Accounts",
    "type": "module",
    "sortOrder": 14,
    "expanded": true,
    "children": [
      {
        "id": 1401,
        "label": "Accounts",
        "type": "submodule",
        "sortOrder": 1,
        "children": [
          { "id": 14001, "label": "Banking", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      },
      {
        "id": 1402,
        "label": "User Management",
        "type": "submodule",
        "sortOrder": 2,
        "children": [
          { "id": 14002, "label": "Manage Access", "type": "tab", "sortOrder": 1, "children": [] }
        ]
      }
    ]
  },
  {
    "id": 15,
    "label": "System Setting",
    "type": "module",
    "sortOrder": 15,
    "children": [
      { "id": 15001, "label": "Sales Settings", "type": "tab", "sortOrder": 1, "children": [] },
      { "id": 15002, "label": "Formate Editor", "type": "tab", "sortOrder": 2, "children": [] },
      { "id": 15003, "label": "Hsn Master", "type": "tab", "sortOrder": 3, "children": [] },
      { "id": 15004, "label": "Version Control", "type": "tab", "sortOrder": 4, "children": [] }
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



