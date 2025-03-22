
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function DeliveryZones() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [formData, setFormData] = useState({
    city: '',
    province: '',
    radius_km: 0,
    is_active: true
  });
  
  // Fetch delivery zones
  const { data: zonesData, isLoading } = useQuery({
    queryKey: ['deliveryZones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('province');
        
      if (error) {
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Add delivery zone mutation
  const addZoneMutation = useMutation({
    mutationFn: async (zoneData: any) => {
      const { error } = await supabase
        .from('delivery_zones')
        .insert(zoneData);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success('Delivery zone added successfully');
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add delivery zone');
    }
  });
  
  // Update delivery zone mutation
  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('delivery_zones')
        .update(data)
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success('Delivery zone updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update delivery zone');
    }
  });
  
  // Delete delivery zone mutation
  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success('Delivery zone deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedZone(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete delivery zone');
    }
  });
  
  // Toggle zone active status mutation
  const toggleZoneStatusMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('delivery_zones')
        .update({ is_active: isActive })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success(`Delivery zone ${variables.isActive ? 'activated' : 'deactivated'}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update zone status');
    }
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked
    });
  };
  
  const resetForm = () => {
    setFormData({
      city: '',
      province: '',
      radius_km: 0,
      is_active: true
    });
  };
  
  const openEditDialog = (zone: any) => {
    setSelectedZone(zone);
    setFormData({
      city: zone.city,
      province: zone.province,
      radius_km: zone.radius_km || 0,
      is_active: zone.is_active
    });
    setIsEditDialogOpen(true);
  };
  
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    addZoneMutation.mutate(formData);
  };
  
  const handleUpdateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedZone) {
      updateZoneMutation.mutate({
        id: selectedZone.id,
        data: formData
      });
    }
  };
  
  const handleDeleteZone = () => {
    if (selectedZone) {
      deleteZoneMutation.mutate(selectedZone.id);
    }
  };
  
  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    toggleZoneStatusMutation.mutate({
      id,
      isActive: !currentStatus
    });
  };
  
  // Filter zones based on search term
  const filteredZones = zonesData?.filter(zone => 
    zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.province.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
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
            Manage where you deliver your ice cream
          </p>
        </motion.div>
        
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Delivery Zones</CardTitle>
                  <CardDescription>Set the areas where your ice cream shop delivers</CardDescription>
                </div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Zone
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search zones..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : filteredZones.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No delivery zones</h3>
                  <p className="text-muted-foreground mb-6">Add a new delivery zone to get started.</p>
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Delivery Zone
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Province/Governorate</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Radius (km)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredZones.map((zone) => (
                        <TableRow key={zone.id}>
                          <TableCell className="font-medium">{zone.province}</TableCell>
                          <TableCell>{zone.city}</TableCell>
                          <TableCell>{zone.radius_km || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={zone.is_active}
                                onCheckedChange={() => handleToggleStatus(zone.id, zone.is_active)}
                              />
                              <span className={zone.is_active ? 'text-green-600' : 'text-gray-500'}>
                                {zone.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(zone)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedZone(zone);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Zone Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Delivery Zone</DialogTitle>
            <DialogDescription>
              Add a new area where your ice cream shop delivers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddZone}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="province" className="text-right">
                  Province/Governorate
                </Label>
                <Input
                  id="province"
                  name="province"
                  className="col-span-3"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  className="col-span-3"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="radius_km" className="text-right">
                  Radius (km)
                </Label>
                <Input
                  id="radius_km"
                  name="radius_km"
                  type="number"
                  className="col-span-3"
                  value={formData.radius_km}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <span>{formData.is_active ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Zone</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Zone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Zone</DialogTitle>
            <DialogDescription>
              Update the delivery zone details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateZone}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-province" className="text-right">
                  Province/Governorate
                </Label>
                <Input
                  id="edit-province"
                  name="province"
                  className="col-span-3"
                  value={formData.province}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-city" className="text-right">
                  City
                </Label>
                <Input
                  id="edit-city"
                  name="city"
                  className="col-span-3"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-radius" className="text-right">
                  Radius (km)
                </Label>
                <Input
                  id="edit-radius"
                  name="radius_km"
                  type="number"
                  className="col-span-3"
                  value={formData.radius_km}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <span>{formData.is_active ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Zone Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Delivery Zone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this delivery zone? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteZone}
            >
              Delete Zone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
