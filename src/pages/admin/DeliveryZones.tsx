
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MapPin,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// We need to work with any type for now
type DeliveryZone = any;

export default function AdminDeliveryZones() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [formData, setFormData] = useState({
    city: '',
    province: '',
    radiusKm: '',
    isActive: true
  });
  
  // Fetch delivery zones - using mock data for now
  const { data: zones = [], isLoading } = useQuery({
    queryKey: ['deliveryZones'],
    queryFn: async () => {
      try {
        // In a real implementation, we would fetch from our database
        // For now, return mock data
        return [
          { id: '1', city: 'Kuwait City', province: 'Capital', radius_km: 5, is_active: true },
          { id: '2', city: 'Salmiya', province: 'Hawalli', radius_km: 3, is_active: true },
          { id: '3', city: 'Jahra', province: 'Jahra', radius_km: 4, is_active: false },
          { id: '4', city: 'Ahmadi', province: 'Ahmadi', radius_km: 5, is_active: true },
          { id: '5', city: 'Fahaheel', province: 'Ahmadi', radius_km: 3, is_active: true },
        ];
      } catch (error) {
        console.error('Error fetching delivery zones:', error);
        return [];
      }
    }
  });
  
  // Add delivery zone mutation
  const addZoneMutation = useMutation({
    mutationFn: async (zoneData: any) => {
      // In a real implementation, we would add to our database
      // For now, just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id: Math.random().toString(), ...zoneData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Delivery zone added successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to add delivery zone: ${error.message}`);
    }
  });
  
  // Update delivery zone mutation
  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      // In a real implementation, we would update our database
      // For now, just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      setIsDialogOpen(false);
      resetForm();
      toast.success('Delivery zone updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update delivery zone: ${error.message}`);
    }
  });
  
  // Delete delivery zone mutation
  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      // In a real implementation, we would delete from our database
      // For now, just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      setIsDeleteDialogOpen(false);
      setSelectedZone(null);
      toast.success('Delivery zone deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete delivery zone: ${error.message}`);
    }
  });
  
  // Toggle active status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      // In a real implementation, we would update our database
      // For now, just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, is_active: isActive };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success(`Delivery zone ${variables.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error: any) => {
      toast.error(`Failed to update status: ${error.message}`);
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };
  
  const handleOpenDialog = (zone?: DeliveryZone) => {
    if (zone) {
      setSelectedZone(zone);
      setFormData({
        city: zone.city,
        province: zone.province,
        radiusKm: zone.radius_km.toString(),
        isActive: zone.is_active
      });
    } else {
      setSelectedZone(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };
  
  const resetForm = () => {
    setFormData({
      city: '',
      province: '',
      radiusKm: '',
      isActive: true
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const zoneData = {
      city: formData.city,
      province: formData.province,
      radius_km: parseFloat(formData.radiusKm),
      is_active: formData.isActive
    };
    
    if (selectedZone) {
      updateZoneMutation.mutate({ id: selectedZone.id, data: zoneData });
    } else {
      addZoneMutation.mutate(zoneData);
    }
  };
  
  const handleDelete = () => {
    if (selectedZone) {
      deleteZoneMutation.mutate(selectedZone.id);
    }
  };
  
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id, isActive: !currentStatus });
  };
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="page-container pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-4 py-1 mb-4 rounded-full bg-gelatico-baby-pink/30 text-gelatico-pink text-sm font-medium uppercase tracking-wider">
            Admin Area
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Delivery Zones</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage the areas where your ice cream can be delivered
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Delivery Zones</CardTitle>
                  <CardDescription>Manage areas where your ice cream delivery is available</CardDescription>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : zones && zones.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>Province</TableHead>
                        <TableHead>Radius (km)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {zones.map((zone: DeliveryZone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.city}</TableCell>
                          <TableCell>{zone.province}</TableCell>
                          <TableCell>{zone.radius_km} km</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {zone.is_active ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span>Active</span>
                                </div>
                              ) : (
                                <div className="flex items-center text-red-600">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  <span>Inactive</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleOpenDialog(zone)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedZone(zone);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(zone.id, zone.is_active)}
                                >
                                  {zone.is_active ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Delivery Zones</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven't added any delivery zones yet. Add zones to define where your ice cream can be delivered.
                  </p>
                  <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Zone
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add/Edit Zone Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedZone ? 'Edit Delivery Zone' : 'Add New Delivery Zone'}
            </DialogTitle>
            <DialogDescription>
              {selectedZone 
                ? 'Update delivery zone information' 
                : 'Define a new area where you deliver ice cream'
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="province" className="text-right">
                  Province
                </Label>
                <Input
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="radiusKm" className="text-right">
                  Radius (km)
                </Label>
                <Input
                  id="radiusKm"
                  name="radiusKm"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={formData.radiusKm}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isActive">
                    {formData.isActive ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addZoneMutation.isPending || updateZoneMutation.isPending}>
                {addZoneMutation.isPending || updateZoneMutation.isPending 
                  ? 'Saving...' 
                  : selectedZone ? 'Save Changes' : 'Add Zone'
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Delivery Zone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this delivery zone? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedZone && (
              <div className="p-4 border border-red-100 bg-red-50 rounded-md">
                <p><strong>City:</strong> {selectedZone.city}</p>
                <p><strong>Province:</strong> {selectedZone.province}</p>
                <p><strong>Radius:</strong> {selectedZone.radius_km} km</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleteZoneMutation.isPending}
            >
              {deleteZoneMutation.isPending ? 'Deleting...' : 'Delete Zone'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
