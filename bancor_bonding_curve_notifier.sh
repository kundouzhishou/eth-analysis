echo "stop bancor_bonding_curve_notifier service ..."
ps -ef | grep bancor_bonding_curve_notifier.js | grep -v grep | awk '{print $2}' | xargs kill -9
sleep 1
echo "start bancor_bonding_curve_notifier service ..."
nohup node bancor_bonding_curve_notifier.js >>bancor_bonding_curve_notifier.log 2>&1 &