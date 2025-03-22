
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
import { CheckCircle, Search, Plus, MapPin, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function DeliveryZones() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddZoneDialogOpen, setIsAddZoneDialogOpen] = useState(false);
  const [isEditZoneDialogOpen, setIsEditZoneDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    city: '',
    province: '',
    radius_km: 10,
    is_active: true
  });
  
  // Get all delivery zones
  const { data: zones, isLoading } = useQuery({
    queryKey: ['deliveryZones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('delivery_zones')
        .select('*')
        .order('province', { ascending: true })
        .order('city', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      return data || [];
    }
  });
  
  // Add new zone mutation
  const addZoneMutation = useMutation({
    mutationFn: async (zoneData: any) => {
      const { error } = await supabase
        .from('delivery_zones')
        .insert(zoneData);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      setIsAddZoneDialogOpen(false);
      resetForm();
      toast.success('Delivery zone added successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to add zone: ${error.message}`);
    }
  });
  
  // Update zone mutation
  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('delivery_zones')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      setIsEditZoneDialogOpen(false);
      setSelectedZone(null);
      toast.success('Delivery zone updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update zone: ${error.message}`);
    }
  });
  
  // Delete zone mutation
  const deleteZoneMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('delivery_zones')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveryZones'] });
      toast.success('Delivery zone deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete zone: ${error.message}`);
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
      radius_km: 10,
      is_active: true
    });
  };
  
  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    addZoneMutation.mutate(formData);
  };
  
  const handleEditZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedZone) {
      updateZoneMutation.mutate({
        id: selectedZone.id,
        data: formData
      });
    }
  };
  
  const handleDeleteZone = (id: string) => {
    if (confirm('Are you sure you want to delete this delivery zone?')) {
      deleteZoneMutation.mutate(id);
    }
  };
  
  const openEditDialog = (zone: any) => {
    setSelectedZone(zone);
    setFormData({
      city: zone.city,
      province: zone.province,
      radius_km: zone.radius_km || 10,
      is_active: zone.is_active !== false // Default to true if undefined
    });
    setIsEditZoneDialogOpen(true);
  };
  
  // Filter zones based on search term
  const filteredZones = zones?.filter(zone => 
    zone.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.province.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            Manage where your ice cream can be delivered
          </p>
        </motion.div>
        
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Delivery Zones</CardTitle>
                  <CardDescription>Manage locations where you deliver ice cream</CardDescription>
                </div>
                <Button onClick={() => setIsAddZoneDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
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
              ) : filteredZones && filteredZones.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Province</TableHead>
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
                          <TableCell>{zone.radius_km || 'Not specified'}</TableCell>
                          <TableCell>
                            {zone.is_active !== false ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">Inactive</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openEditDialog(zone)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleDeleteZone(zone.id)}
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
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No delivery zones found</p>
                  <p className="text-muted-foreground mb-6">
                    {searchTerm ? 'Try a different search term' : 'Add your first delivery zone to get started'}
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsAddZoneDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Zone
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Zone Dialog */}
      <Dialog open={isAddZoneDialogOpen} onOpenChange={setIsAddZoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Delivery Zone</DialogTitle>
            <DialogDescription>
              Add a new location where you can deliver ice cream
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddZone}>
            <div className="grid gap-4 py-4">
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
                <Label htmlFor="radius_km" className="text-right">
                  Radius (km)
                </Label>
                <Input
                  id="radius_km"
                  name="radius_km"
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.radius_km}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="is_active" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="is_active">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddZoneDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addZoneMutation.isPending}>
                {addZoneMutation.isPending ? 'Adding...' : 'Add Zone'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Zone Dialog */}
      <Dialog open={isEditZoneDialogOpen} onOpenChange={setIsEditZoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Delivery Zone</DialogTitle>
            <DialogDescription>
              Update delivery zone details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditZone}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-province" className="text-right">
                  Province
                </Label>
                <Input
                  id="edit-province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="col-span-3"
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
                  value={formData.city}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-radius_km" className="text-right">
                  Radius (km)
                </Label>
                <Input
                  id="edit-radius_km"
                  name="radius_km"
                  type="number"
                  min="1"
                  step="0.1"
                  value={formData.radius_km}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-is_active" className="text-right">
                  Active
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch
                    id="edit-is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="edit-is_active">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedZone(null);
                  setIsEditZoneDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateZoneMutation.isPending}>
                {updateZoneMutation.isPending ? 'Updating...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
