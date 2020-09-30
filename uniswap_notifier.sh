echo "stop uniswap service ..."
ps -ef | grep uniswap_notifier.js | grep -v grep | awk '{print $2}' | xargs kill -9
sleep 1
echo "start uniswap service ..."
nohup node uniswap_notifier.js >>uniswap_notifier.log 2>&1 &