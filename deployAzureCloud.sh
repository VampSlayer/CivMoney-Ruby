echo "removing last CivMoney backup..."
sudo rm -R ~/backupCivMoney/CivMoney
echo "backing up current CivMoney..."
cp -R ~/CivMoney ~/backupCivMoney
echo "updating current CivMoney..."
cd ~/CivMoney
echo "getting newest version from git hub..."
git pull
echo "coping database.yml & environments.rb..."
sudo cp ~/backupCivMoney/CivMoney/config/database.yml ~/CivMoney/config
sudo cp ~/backupCivMoney/CivMoney/config/environments.rb ~/CivMoney/config
echo "restarting CivMoney service"
sudo systemctl restart civMoney.service
sudo systemctl status civMoney.service
