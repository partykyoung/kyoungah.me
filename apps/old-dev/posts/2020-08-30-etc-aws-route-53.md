---
title: AWS 도메인 설정
date: 2020-08-30 18:27:50
tags: ["AWS"]
publish: true
---

## AWS Route 53

높은 가용성과 확장성이 뛰어난 클라우드 Domain Name System (DNS) 웹 서비스. 일반적인 DNS 기능 + 모니터링 기능 + 서버 로드 밸런싱 기능 + 글로벌 서버 로드 밸런싱 기능을 제공한다.

> **DNS (Domain Name System)**: 네트워크에 연결된 호스트들은 각각 IP 주소들을 가지고 있다. 이 IP 주소는 사람이 이해하고 기억하기 어렵기 때문에 각 IP 주소마다 도메인 이름을 부여한다. DNS는 특정 도메인에 대한 요청이 들어오면 도메인에 대한 IP 주소를 반환해준다. 반대로 IP 주소에 대한 도메인 이름을 반환해 줄 수도 있다.

Route 53은 프리티어 대상이 아니므로 매달 사용한 만큼 요금이 빠져나간다. 다행히 요금은 저렴한 편이다.

## Route 53 도메인 등록

AWS에서 사용하고 있는 서비스에 도메인을 등록하기 위해서는 먼저 Route 53 서비스에 도메인을 등록해야 한다. 도메인은 AWS 서비스에서도 구매할 수 있고 카페 24나 호스팅kr 같은 국내 호스팅 서비스에서도 구매할 수 있다. 나는 국내 호스팅 서비스에서 토이 프로젝트에 사용할 wolfonair.com 도메인을 구입했다. 이 도메인을 AWS Route 53 서비스에 등록해보자.

![AWS 서비스 메뉴](/images/posts/aws-route-53-1.png)

AWS 서비스 메뉴 검색창에서 Route 53을 검색하거나 메뉴 목록에서 Route 53을 클릭하여 Route 53 대쉬보드 창으로 이동한다.

![DNS 관리](/images/posts/aws-route-53-2.png)

DNS 관리에서 호스팅 영역 생성 버튼을 클릭한다.

호스팅 영역이란 레코드의 컨테이너이다. 레코드에는 특정 도메인과(ex: example.com)과 하위 도메인(ex: api.example.com, cdn.example.com)의 트래픽을 라우팅하는 방식에 대한 정보가 포함된다. 호스팅 영역과 해당 도메인의 이름은 동일하다.

![호스팅 영역 구성](/images/posts/aws-route-53-3.png)

소유하고 있는 도메인 이름을 입력한다. 설명은 입력해도 되고 그냥 냅둬도 된다.

퍼블릭 호스팅 영역은 누구나 인터넷에서 도메인을 입력하여 트래픽을 라우팅 할 수 있고 프라이빗 호스팅 영역은 AWS VPC 내에서만 사용할 수 있다.
때문에 프라이빗 클라우드를 만드는게 아니면 유형 부분은 따로 건드릴 필요가 없고 퍼블릭 호스팅 영역으로 그대로 두면 된다.

쭉 내려서 호스팅 영역 생성 버튼을 눌러주면 호스팅 영역 생성이 완료된다.

![호스팅 영역 구성](/images/posts/aws-route-53-4.png)

생성이 완료되면 NS(네임서버) 레코드와 SOA(권한시작) 레코드가 자동 생성된다. 이 네임서버가 등록한 도메인이 사용할 네임서버이기 때문에 등록한 도메인의 네임서버를 Route 53의 네임서버로 교체해주어야 한다.

> **네임 서버**: DNS를 운영하는 서버. 특정 도메인이 어떤 IP와 연결되었다는 것을 기록하고 이것을 다른 DNS들에게 전파하는 역할을 한다. 예를 들어 abc.com 이라는 도메인이 있으면 이 도메인을 192.168.0.1 이라는 아이피를 가진 서버와 연결을 해준다.

![네임서버 수정](/images/posts/aws-route-53-5.png)

도메인을 구입한 사이트로 이동하여 구입한 도메인의 DNS 관리 화면으로 이동한 후 네임서버 항목에 Route 53의 네임서버 4개를 입력하고 확인 또는 저장 버튼을 누르면 네임서버 수정이 완료 된다.

Route 53을 이용하면 S3, CloudFront, EC2, ELB 등 몇몇 AWS 리소스에 도메인을 쉽게 연동할 수 있다. Route 53에 도메인 등록 하는 작업을 완료 했으니 기존에 사이드 프로젝트로 사용하고 있던 CloudFront, Api gateway에 도메인을 한번 연동해보자.

## AWS Certificate Manager 설정

Route 53에 도메인을 등록하면 AWS Certificate Manageer을 사용하여 무료로 SSL 인증서를 발급받을 수 있다.

> **SSL 인증서**: 클라이언트와 서버간의 통신을 제3자가 보증해주는 전자화된 문서. 웹서버와 웹사이트에서 이루어지는 모든 정보전송을 https 암호화 프로토콜을 통해 안전하게 전송되도록 하는 인증서이다.

![AWS 서비스 메뉴](/images/posts/aws-route-53-6.png)

AWS 서비스 메뉴에서 Certificate Manager을 검색하여 Certificate Manager 메뉴 대시보드 화면으로 이동한다.

![인증서 프로비저닝 선택](/images/posts/aws-route-53-7.png)

아무 인증서도 발급받지 않은 상태라면 위의 이미지와 같은 화면이 뜬다. 여기서 인증서 프로비저닝 항목 밑의 시작하기 버튼을 클릭한다.

![공인 인증서 요청 선택](/images/posts/aws-route-53-8.png)

공인 인증서 요청 항목을 선택한 후 인증서 요청 버튼을 클릭한다.

![도메인 이름 추가](/images/posts/aws-route-53-9.png)

도메인 이름 항목에 Route 53에 등록한 도메인을 입력한다. 하위 도메인도 사용하려면 '\*.도메인 이름' 으로 등록해주면 된다. 도메인 입력이 완료 되었으면 확인 버튼을 클릭한다.

![검증 방법 선택](/images/posts/aws-route-53-10.png)

DNS 검증 항목을 선택한 후 다음 버튼을 클릭한다.

![태그 추가](/images/posts/aws-route-53-11.png)

태그 추가는 필수가 아니라 그냥 무시하고 검토 버튼을 눌러 다음 화면으로 넘어가도 상관없다.

![검토](/images/posts/aws-route-53-12.png)

실수한 부분이 있는지 잘 확인한 후 없으면 확인 및 요청 버튼을 클릭한다.

![검증 화면](/images/posts/aws-route-53-13.png)

도메인이 검증 보류 상태로 등록되었다.

![검증 화면 2](/images/posts/aws-route-53-14.png)

도메인 앞의 화살표 버튼을 누르면 CNAME 레코드 항목을 추가하라는 화면이 출력된다. Route 53에 등록한 도메인은 Route 53에서 레코드 생성 버튼을 클릭하여 자동으로 CNAME 레코드 항목을 생성할 수 있다. Route 53에서 레코드 생성 버튼을 클릭한다.

![Route 53에서 레코드 생성](/images/posts/aws-route-53-15.png)

생성 버튼을 클릭한다.

![Route 53에서 레코드 생성 성공](/images/posts/aws-route-53-16.png)

성공 메시지가 뜨면 완료가 된 것이다. 검증이 완료 되려면 최대 30분 정도 걸릴 수 있다고 했지만 체감상 1 ~ 2분 걸렸던 것 같다.

## CloudFront 커스텀 도메인 설정

저번에 현재 진행하고 있는 [사이드 프로젝트를 S3에 업로드 한 후 CloudFront 설정](/2020-07-26-etc-aws-s3-hosting/)까지 했었다. CloudFront를 사용하여 S3에 올라가있는 웹페이지에 커스텀 도메인을 연결해보자.

AWS 서비스 메뉴에서 CloudFront를 검색하여 해당 서비스로 이동하면 CloudFront Distributions 목록을 확인할 수 있다. 도메인 연결을 원하는 Distribution 항목의 ID를 클릭하여 상세 페이지로 이동한 후 General 탭에 있는 Edit 버튼을 눌러 편집 화면으로 이동할 수 있다.

![클라우드 프론트 커스텀 도메인 설정](/images/posts/aws-route-53-17.png)

Alternate Domain Names 항목에서 Route 53에 등록된 도메인을 입력한다. SSL Certificate 항목에서 Custom SSL Certificate 항목을 선택하고 인증서를 선택한 후 스크롤을 쭉 내려 Edit 버튼을 클릭해주면 도메인 연결이 끝난다.

CloudFront에서 ssl 인증서를 적용하려면 미국 동부(버지니아 북부, us-east-1) 리전에도 SSL 인증서가 있어야 한다. 다행히 Certificate Manager 서비스는 무료이므로 미국 동부 리전을 선택한 후 Certificate Manager 서비스로 똑같이은 방법으로 SSL 인증서를 발급받을 수 있다.

![커스텀 도메인 설정 완료](/images/posts/aws-route-53-18.png)

약 1분이 지난후 웹브라우저 url에 커스텀 도메인을 입력하면 접속이 잘 되는 것을 확인할 수 있다.

## API Gateway 도메인 설정 (feat. Serverless)

AWS에서 제공하는 Lambda와 API Gateway 서비스를 같이 사용하면 서버리스 아키텍처로 백엔드 서버를 운영할 수 있다. Serverless 프레임워크를 사용하면 아주 간편하게 Lambda 작성 및 배포까지 가능한데 serverless-domain-manager 플러그인을 추가로 사용하면 커스텀 도메인 설정까지 가능하다.

```
acm:ListCertificates                *
apigateway:GET                      /domainnames/*
apigateway:GET                      /domainnames/*/basepathmappings
apigateway:DELETE                   /domainnames/*
apigateway:POST                     /domainnames
apigateway:POST                     /domainnames/*/basepathmappings
apigateway:PATCH                    /domainnames/*/basepathmapping
cloudformation:GET                  *
cloudfront:UpdateDistribution       *
route53:ListHostedZones             *
route53:ChangeResourceRecordSets    hostedzone/{HostedZoneId}
route53:GetHostedZone               *
route53:ListResourceRecordSets      *
iam:CreateServiceLinkedRole         arn:aws:iam::${AWS::AccountId}: role/aws-service-role/ops.ap
```

serverless-domain-manager 플러그인을 사용하려면 Serverless에 연동되어 있는 IAM 권한에 위의 권한이 추가로 더 필요하다.

![IAM 권한 설정](/images/posts/aws-route-53-19.png)

일단은 관련된 권한을 찾은 후 FullAccess 권한을 주긴 했는데 좀 더 안전한 보안을 위해서 나중에 다시 수정할 예정이다.

```
npm install serverless-domain-manager --save-dev

```

serverless-domain-manager 플러그인을 설치한다.

```yml
plugins:
  - serverless-webpack
  - serverless-offline
  - serverless-dotenv-plugin
  - serverless-domain-manager

custom:
  customDomain:
    domainName: api.wolfonair.com
    stage: ${self:provider.stage}
    certificateName: "*.wolfonair.com"
    createRoute53Record: true
    endpointType: regional
    securityPolicy: tls_1_2
    apiType: rest
```

serverless.yml파일에서 plugins 항목에는 serverless-domain-manager을 추가해주고 custom 항목에는 coustomDomain 설정을 추가로 넣어준다.

```
sls create_domain
sls deploy
```

위의 명령어를 실행해주면 도메인 설정이 끝난다.

![API Gateway 사용자 지정 도메인 이름](/images/posts/aws-route-53-20.png)

AWS API Gateway 서비스에 직접 들어가 사용자 지정 도메인 이름 항목을 클릭해보면 도메인이 정상 등록 된 것을 확인할 수 있다.

## 마무리

이렇게 Route 53을 이용하여 도메인을 등록하고 Certificate Manager를 이용하여 SSL 인증서 까지 발급받은 후 CloudFront, API Gateway에 도메인 연결까지 해보았다. EC2에도 SSL 인증서를 적용하여 커스텀 도메인을 달고 싶었는데 ELB를 사용하여 좀 편하게 SSL 인증서를 적용하려 했더니 ELB가 따로 프리티어를 제공하질 않는다는걸 알고 일단은 잠시 보류하기로 했다. 다음에 시간이 날때 무료 SSL 인증서를 이용하여 EC2에 https를 적용한 커스텀 도메인을 달아봐야겠다.

## Reference

> - [Amazon Route53 101 - 서태호 | 강남비기너모임 : AWS Community Day](https://www.youtube.com/watch?v=Nr7nLwfvT3Y)
> - [많이 혼돈하시는 네임서버와 DNS](https://xetown.com/topics/1125037)
> - [AWS Route 53 DNS 서비스 사용하기](https://velog.io/@minholee_93/AWS-Route-53-DNS-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-8lk40vfqt4#2-route-53-%EB%8F%84%EB%A9%94%EC%9D%B8-%EB%93%B1%EB%A1%9D%ED%95%98%EA%B8%B0)
> - [새 도메인 이름 구입한 후 AWS에서 해야할 일](https://musma.github.io/2019/09/16/what-to-do-after-you-buy-your-new-domain-on-aws.html#aws-certificate-manager-ssltls-%EC%9D%B8%EC%A6%9D%EC%84%9C-%EB%B0%9C%EA%B8%89)
> - [리액트 앱 AWS S3, CloudFront 에 배포하기](https://react-etc.vlpt.us/08.deploy-s3.html)
> - [Serverless Domain Manager](https://www.serverless.com/plugins/serverless-domain-manager)
