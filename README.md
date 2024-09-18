# cdk-missing-interface-endpoint
AWS CDKで未対応なInterface Endpoint一覧作成ツール

us-east-1リージョンに対するInterface VPC Endpoint一覧表示CLIを実行し、CDKコードと比較した結果をまとめています。

```sh
aws ec2 describe-vpc-endpoint-services --filters Name=service-type,Values=Interface Name=owner,Values=amazon --region us-east-1 --query ServiceNames
```

結果は[missing-services.json](https://github.com/badmintoncryer/cdk-missing-interface-endpoint/blob/main/missing_services.json)にまとめられています。
