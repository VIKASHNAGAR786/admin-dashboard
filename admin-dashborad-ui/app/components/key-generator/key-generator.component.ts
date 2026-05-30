import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeneratedKey, Client } from '../../../models/types';
import { format, parseISO } from 'date-fns';
import { AlertService } from '../../../services/alert.service';
import { DataService } from '../../../services/data.service';

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
            { "id": 14163, "label": "Manage", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14230, "label": "Product Mapping", "type": "tab", "sortOrder": 3, "children": [] }
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
        { "id": 14203, "label": "UPI Configuration", "type": "tab", "sortOrder": 5, "children": [] },
        { "id": 14206, "label": "Backup Config", "type": "tab", "sortOrder": 6, "children": [] }
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
            { "id": 14205, "label": "SUPPLIER WISE SALE REPORT", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14231, "label": "PURCHASE REPORT", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14232, "label": "SUPPLIER LEDGER", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        }
      ]
    },
    {
      "id": 14207,
      "label": "Unified Purchase",
      "type": "module",
      "sortOrder": 18,
      "children": [
        {
          "id": 14208,
          "label": "Purchase Orders",
          "type": "submodule",
          "sortOrder": 1,
          "children": [
            { "id": 14209, "label": "Create PO", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14210, "label": "PO List", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14211, "label": "PO Approval", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14212,
          "label": "Goods Receipt",
          "type": "submodule",
          "sortOrder": 2,
          "children": [
            { "id": 14213, "label": "Create GRN", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14214, "label": "GRN List", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14215, "label": "QA Approval", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14216,
          "label": "Stock Ledger",
          "type": "submodule",
          "sortOrder": 3,
          "children": [
            { "id": 14217, "label": "Stock Movements", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14218, "label": "Stock Balance", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14219,
          "label": "Purchase Returns",
          "type": "submodule",
          "sortOrder": 4,
          "children": [
            { "id": 14220, "label": "Create Return", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14221, "label": "Return List", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14222, "label": "Debit Notes", "type": "tab", "sortOrder": 3, "children": [] }
          ]
        },
        {
          "id": 14223,
          "label": "Landed Cost",
          "type": "submodule",
          "sortOrder": 5,
          "children": [
            { "id": 14224, "label": "Add Cost", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14225, "label": "Cost History", "type": "tab", "sortOrder": 2, "children": [] }
          ]
        },
        {
          "id": 14226,
          "label": "Purchase Reports",
          "type": "submodule",
          "sortOrder": 6,
          "children": [
            { "id": 14227, "label": "Purchase Summary", "type": "tab", "sortOrder": 1, "children": [] },
            { "id": 14228, "label": "Supplier Performance", "type": "tab", "sortOrder": 2, "children": [] },
            { "id": 14229, "label": "Purchase vs Sales", "type": "tab", "sortOrder": 3, "children": [] }
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
  @Input() clients: Client[] = [];
  @Input() set keyToEdit(keyData: GeneratedKey | null) {
    if (keyData) {
      this.selectedClientId = keyData.clientId;
      this.plan = keyData.plan;
      this.expirationDate = keyData.expirationDate ? keyData.expirationDate.split('T')[0] : '';
      this.editingKeyId = keyData.id || null;
      this.isEditing = true;
      this.clientSearchQuery = '';
      if (keyData.modules) {
        this.loadModulesFromKey(keyData.modules);
      }
    } else {
      // Avoid clearing if we are already in initial state
      if (this.selectedClientId || this.plan || this.expirationDate || this.isEditing) {
        this.resetForm();
      }
    }
  }
  @Output() onGenerateKey = new EventEmitter<Omit<GeneratedKey, 'id' | 'generatedAt'>>();
  @Output() onCancelEdit = new EventEmitter<void>();

  moduleHierarchy: ModuleNode[] = JSON.parse(JSON.stringify(MODULE_HIERARCHY)); // Deep clone so multiple renders don't conflict

  selectedClientId: string = '';
  plan: string = '';
  expirationDate: string = '';
  selectedModules: any[] = [];

  // New Features for Refined UX
  clientSearchQuery: string = '';
  editingKeyId: string | null = null;
  isEditing: boolean = false;

  // Accordion Group Expansion States
  expandedCoreGroup: boolean = true;
  expandedTransactionsGroup: boolean = false;
  expandedIndustriesGroup: boolean = false;

  isCoreModule(nodeId: number): boolean {
    return [14096, 14157, 14164, 14171, 14188, 14193].includes(nodeId);
  }

  isTransactionModule(nodeId: number): boolean {
    return [14099, 14207].includes(nodeId);
  }

  isIndustryModule(nodeId: number): boolean {
    return [14103, 14109, 14115, 14121, 14127, 14176, 14182, 14133, 14139, 14145, 14151].includes(nodeId);
  }

  getSelectedModulesCount(): number {
    return this.buildSelectedTree(this.moduleHierarchy).length;
  }

  constructor(
    private alertService: AlertService,
    private dataService: DataService
  ) { }

  applyPreset(presetName: string): void {
    // Clear first
    this.cascadeSelection({ children: this.moduleHierarchy } as any, false);

    let targetIds: number[] = [];

    // Core module IDs that are general and usually included in every preset
    const coreIds = [
      14096, 14097, 14098, // Dashboard, Main Dashboard, Overview
      14171, 14172, 14173, 14174, 14175, 14203, 14206, // System Setting & tabs
      14164, 14165, 14166, 14167, 14168, 14169, 14170, // System & Accounts & tabs
      14157, 14158, 14159, 14160, 14161, 14162, 14163, 14230, // Contacts & tabs
      14193, 14194, 14195, 14196, 14197, 14204, 14205, 14231, 14232, // Reports & tabs
      14188, 14189, 14190, 14191, 14192 // Barcode Designer & tabs
    ];

    switch (presetName) {
      case 'pharmacy':
        targetIds = [
          ...coreIds,
          14176, 14177, 14178, 14179, 14202, 14180, 14181, 14198, 14199, 14200, 14201, // Pharmacy modules
          14099, 14100, 14101, 14102, // Unified Sales
          14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218, 14219, 14220, 14221, 14222, 14223, 14224, 14225, 14226, 14227, 14228, 14229 // Unified Purchase
        ];
        break;
      case 'optical':
        targetIds = [
          ...coreIds,
          14127, 14128, 14129, 14130, 14131, 14132, // Optical modules
          14099, 14100, 14101, 14102 // Unified Sales
        ];
        break;
      case 'supermarket':
        targetIds = [
          ...coreIds,
          14133, 14134, 14135, 14136, 14137, 14138, // Supermarket
          14099, 14100, 14101, 14102, // Unified Sales
          14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218, 14219, 14220, 14221, 14222, 14223, 14224, 14225, 14226, 14227, 14228, 14229 // Unified Purchase
        ];
        break;
      case 'autoparts':
        targetIds = [
          ...coreIds,
          14115, 14116, 14117, 14118, 14119, 14120, // Auto Parts
          14099, 14100, 14101, 14102, // Unified Sales
          14207, 14208, 14209, 14210, 14211, 14212, 14213, 14214, 14215, 14216, 14217, 14218, 14219, 14220, 14221, 14222, 14223, 14224, 14225, 14226, 14227, 14228, 14229 // Unified Purchase
        ];
        break;
      case 'all':
        this.cascadeSelection({ children: this.moduleHierarchy } as any, true);
        this.updateParentSelectionStates(this.moduleHierarchy);
        this.alertService.success('Selected all modules!');
        return;
      case 'clear':
        this.cascadeSelection({ children: this.moduleHierarchy } as any, false);
        this.updateParentSelectionStates(this.moduleHierarchy);
        this.alertService.success('Cleared all selections!');
        return;
    }

    this.selectNodesByIds(this.moduleHierarchy, targetIds);
    this.updateParentSelectionStates(this.moduleHierarchy);
    this.alertService.success(`Applied ${presetName} preset!`);
  }

  private selectNodesByIds(nodes: ModuleNode[], ids: number[]): void {
    nodes.forEach(node => {
      if (ids.includes(node.id)) {
        node.selected = true;
      }
      if (node.children && node.children.length > 0) {
        this.selectNodesByIds(node.children, ids);
      }
    });
  }

  applyDatePreset(days: number): void {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    this.expirationDate = targetDate.toISOString().split('T')[0];
  }

  applyLifetimePreset(): void {
    const targetDate = new Date();
    targetDate.setFullYear(targetDate.getFullYear() + 5); // 5 Years validity
    this.expirationDate = targetDate.toISOString().split('T')[0];
  }

  getFilteredClients(): Client[] {
    if (!this.clientSearchQuery) {
      return this.clients;
    }
    const query = this.clientSearchQuery.toLowerCase();
    return this.clients.filter(c => 
      c.companyName.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query) ||
      c.contactPerson.toLowerCase().includes(query)
    );
  }

  cancelEdit(): void {
    this.resetForm();
    this.onCancelEdit.emit();
  }

  loadModulesFromKey(modules: any[]): void {
    const ids: number[] = [];
    const collectIds = (nodes: any[]) => {
      if (!nodes) return;
      nodes.forEach(node => {
        if (node.id) ids.push(node.id);
        if (node.children) collectIds(node.children);
      });
    };
    collectIds(modules);

    this.cascadeSelection({ children: this.moduleHierarchy } as any, false);
    this.selectNodesByIds(this.moduleHierarchy, ids);
    this.updateParentSelectionStates(this.moduleHierarchy);
  }

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

  generateRandomKey(payload: any): string {
    // We use PascalCase for the JSON keys to match the C# backend expectations
    const jsonStr = JSON.stringify(payload);
    // In a real production app, you would encrypt this string with a shared secret here.
    // For now, we use Base64 to satisfy the "contains details" and "can be extracted" requirement.
    return btoa(jsonStr);
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

    if (this.isEditing && this.editingKeyId) {
      this.dataService.renewKey(this.editingKeyId, this.expirationDate, selectedModules).subscribe({
        next: (res: any) => {
          this.alertService.success('Access key updated and renewed successfully!');
          this.dataService.loadGeneratedKeys(); // Reload key list
          this.resetForm();
          this.onCancelEdit.emit();
        },
        error: (err) => {
          this.alertService.error(err.error?.message || 'Failed to update access key');
        }
      });
      return;
    }

    // Create the structured payload that the ERP system expects
    const payload = {
      ClientId: this.selectedClientId,
      CompanyName: displayName,
      Email: selectedClient?.email || '',
      ContactNumber: selectedClient?.contactNumber || '',
      ContactPerson: selectedClient?.contactPerson || '',
      Address: selectedClient?.address || '',
      Plan: this.plan,
      ExpirationDate: this.expirationDate,
      Modules: selectedModules,
      GeneratedAt: new Date().toISOString()
    };

    const key = this.generateRandomKey(payload);
    this.selectedModules = selectedModules;

    // Emit both the key data and the clientId
    this.onGenerateKey.emit({
      key,
      clientId: this.selectedClientId,
      clientName: displayName, // Map to clientName in GeneratedKey interface
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
    this.editingKeyId = null;
    this.isEditing = false;
    this.clientSearchQuery = '';
  }

  formatDate(dateString: string): string {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  }
}



