#Will create a 1 GiB file (/mnt/1GiB.swap) to use as swap
sudo fallocate -l 1g /mnt/1GiB.swap

#Set the swap file permissions to 600 to prevent other users
sudo chmod 600 /mnt/1GiB.swap

#Format the file as swap
sudo mkswap /mnt/1GiB.swap


#Enable use of Swap File
sudo swapon /mnt/1GiB.swap

#Enable Swap File at Bootup
echo '/mnt/1GiB.swap swap swap defaults 0 0' | sudo tee -a /etc/fstab