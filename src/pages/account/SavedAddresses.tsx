
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { checkoutService } from '@/services/checkout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Plus, Pencil, Trash2, Home, Building, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SavedAddresses() {
  const [isAddAddressDialogOpen, setIsAddAddressDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  const { data: addressesData, isLoading } = useQuery({
    queryKey: ['userAddresses'],
    queryFn: () => checkoutService.getUserAddresses(),
  });
  
  const addAddressMutation = useMutation({
    mutationFn: (addressData: any) => checkoutService.addAddress(addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
      setIsAddAddressDialogOpen(false);
      toast.success('Address added successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add address');
    }
  });
  
  const updateAddressMutation = useMutation({
    mutationFn: (addressData: any) => checkoutService.updateAddress(addressData.id, addressData.address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
      setIsEditAddressDialogOpen(false);
      toast.success('Address updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update address');
    }
  });
  
  const deleteAddressMutation = useMutation({
    mutationFn: (addressId: string) => checkoutService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
      setIsDeleteDialogOpen(false);
      toast.success('Address deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete address');
    }
  });
  
  const setDefaultAddressMutation = useMutation({
    mutationFn: (addressId: string) => checkoutService.setDefaultAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
      toast.success('Default address updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update default address');
    }
  });
  
  const addresses = addressesData?.success ? addressesData.addresses : [];
  
  const handleAddAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const addressData = {
      first_name: formData.get('first_name') as string,
      last_name: formData.get('last_name') as string,
      address1: formData.get('address1') as string,
      address2: formData.get('address2') as string || '',
      city: formData.get('city') as string,
      province: formData.get('province') as string,
      zip: formData.get('zip') as string,
      country: formData.get('country') as string,
      phone: formData.get('phone') as string,
      is_default: formData.get('is_default') === 'on'
    };
    
    addAddressMutation.mutate(addressData);
  };
  
  const handleEditAddress = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const addressData = {
      id: currentAddress.id,
      address: {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        address1: formData.get('address1') as string,
        address2: formData.get('address2') as string || '',
        city: formData.get('city') as string,
        province: formData.get('province') as string,
        zip: formData.get('zip') as string,
        country: formData.get('country') as string,
        phone: formData.get('phone') as string,
        is_default: formData.get('is_default') === 'on'
      }
    };
    
    updateAddressMutation.mutate(addressData);
  };
  
  const handleDeleteAddress = () => {
    if (currentAddress) {
      deleteAddressMutation.mutate(currentAddress.id);
    }
  };
  
  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddressMutation.mutate(addressId);
  };
  
  const AddressForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={isEdit ? handleEditAddress : handleAddAddress} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            defaultValue={isEdit ? currentAddress?.address.first_name : ''} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            defaultValue={isEdit ? currentAddress?.address.last_name : ''} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address1">Address Line 1</Label>
        <Input 
          id="address1" 
          name="address1" 
          defaultValue={isEdit ? currentAddress?.address.address1 : ''} 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address2">Address Line 2 (Optional)</Label>
        <Input 
          id="address2" 
          name="address2" 
          defaultValue={isEdit ? currentAddress?.address.address2 : ''} 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            name="city" 
            defaultValue={isEdit ? currentAddress?.address.city : ''} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="province">Province/State</Label>
          <Input 
            id="province" 
            name="province" 
            defaultValue={isEdit ? currentAddress?.address.province : ''} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="zip">Postal/Zip Code</Label>
          <Input 
            id="zip" 
            name="zip" 
            defaultValue={isEdit ? currentAddress?.address.zip : ''} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            name="country" 
            defaultValue={isEdit ? currentAddress?.address.country : 'Kuwait'} 
            required 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          name="phone" 
          type="tel" 
          defaultValue={isEdit ? currentAddress?.address.phone : ''} 
          required 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input 
          type="checkbox" 
          id="is_default" 
          name="is_default" 
          className="h-4 w-4 rounded border-gray-300 text-gelatico-pink focus:ring-gelatico-pink" 
          defaultChecked={isEdit ? currentAddress?.is_default : false} 
        />
        <Label htmlFor="is_default">Set as default address</Label>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => isEdit ? setIsEditAddressDialogOpen(false) : setIsAddAddressDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isEdit ? updateAddressMutation.isPending : addAddressMutation.isPending}>
          {isEdit ? 'Update Address' : 'Add Address'}
        </Button>
      </DialogFooter>
    </form>
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
            My Addresses
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold font-gelatico mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Manage your delivery addresses
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-6">
            <Button onClick={() => setIsAddAddressDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Address
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Your Addresses</CardTitle>
              <CardDescription>Manage your shipping addresses</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-12">
                  <div className="w-8 h-8 border-4 border-gelatico-pink rounded-full border-t-transparent animate-spin"></div>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No addresses saved</h3>
                  <p className="text-muted-foreground mb-6">Add a new address to get started.</p>
                  <Button onClick={() => setIsAddAddressDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Address
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {addresses.map((address: any) => (
                    <div key={address.id} className="border rounded-md p-6 relative">
                      {address.is_default && (
                        <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="rounded-full p-2 bg-gelatico-baby-pink/20 text-gelatico-pink">
                          {address.address.address2?.toLowerCase().includes('home') || 
                           address.address.address2?.toLowerCase().includes('house') ? (
                            <Home size={20} />
                          ) : (
                            <Building size={20} />
                          )}
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-medium">
                            {address.address.first_name} {address.address.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {address.address.address1}
                            {address.address.address2 && `, ${address.address.address2}`}
                            <br />
                            {address.address.city}, {address.address.province} {address.address.zip}
                            <br />
                            {address.address.country}
                            {address.address.phone && <><br />Phone: {address.address.phone}</>}
                          </p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {!address.is_default && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="h-8 px-2 text-muted-foreground"
                            >
                              <Check className="h-4 w-4 mr-1" /> Set as Default
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => {
                              setCurrentAddress(address);
                              setIsEditAddressDialogOpen(true);
                            }}
                            className="h-8 px-2 text-blue-600"
                          >
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          {!address.is_default && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setCurrentAddress(address);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="h-8 px-2 text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Address Dialog */}
      <Dialog open={isAddAddressDialogOpen} onOpenChange={setIsAddAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
            <DialogDescription>
              Enter your address details below.
            </DialogDescription>
          </DialogHeader>
          <AddressForm />
        </DialogContent>
      </Dialog>
      
      {/* Edit Address Dialog */}
      <Dialog open={isEditAddressDialogOpen} onOpenChange={setIsEditAddressDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>
              Update your address details below.
            </DialogDescription>
          </DialogHeader>
          <AddressForm isEdit={true} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAddress}
              disabled={deleteAddressMutation.isPending}
            >
              {deleteAddressMutation.isPending ? 'Deleting...' : 'Delete Address'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
